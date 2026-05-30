/**
 * Zuno Auto-Authentication
 * ─────────────────────────────────────────────────────
 * Provides seamless, silent authentication for the frontend.
 * On first load the app logs in as "default@zuno.com".
 * If that account doesn't exist, it registers it, creates a
 * default profile, and initialises the current month's funds.
 */

import { apiFetch, getStoredToken, setStoredToken, getStoredUserId } from './client';

// ─── Constants ─────────────────────────────────────────────────────────────

const DEFAULT_EMAIL = 'default@zuno.com';
const DEFAULT_PASSWORD = 'Zuno@2026!';
const DEFAULT_FULLNAME = 'Zuno User';
const BOOTSTRAP_DONE_KEY = 'zuno:bootstrap-done';

// ─── Auth API types ─────────────────────────────────────────────────────────

type AuthResult = {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
};

type FundResult = {
  id: string;
  fundType: string;
  allocatedAmount: string;
  name?: string;
}[];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getCurrentMonthFirstDay(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

function getWeekStart(): string {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // Mon=0
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  return weekStart.toISOString().slice(0, 10);
}

function getWeekEnd(): string {
  const start = new Date(getWeekStart());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end.toISOString().slice(0, 10);
}

// ─── Login ──────────────────────────────────────────────────────────────────

async function loginDefault(): Promise<string | null> {
  const result = await apiFetch<AuthResult>('/api/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD },
  });

  if (!result.ok) return null;
  setStoredToken(result.data.token, result.data.user.id);
  return result.data.token;
}

// ─── Register ───────────────────────────────────────────────────────────────

async function registerDefault(): Promise<string | null> {
  const result = await apiFetch<AuthResult>('/api/auth/register', {
    method: 'POST',
    skipAuth: true,
    body: {
      email: DEFAULT_EMAIL,
      password: DEFAULT_PASSWORD,
      fullName: DEFAULT_FULLNAME,
    },
  });

  if (!result.ok) return null;
  setStoredToken(result.data.token, result.data.user.id);
  return result.data.token;
}

// ─── Init profile ────────────────────────────────────────────────────────────

async function initProfile() {
  const profileResult = await apiFetch('/api/profile');
  if (!profileResult.ok) {
    // Profile doesn't exist — create it
    await apiFetch('/api/profile', {
      method: 'POST',
      body: {
        fullName: DEFAULT_FULLNAME,
        monthlyIncome: 5000000,
        residenceType: 'dorm',
      },
    });
  }
}

// ─── Init funds ──────────────────────────────────────────────────────────────

async function initFundsForCurrentMonth() {
  const month = getCurrentMonthFirstDay();

  // Check if funds already exist for this month
  const fundsResult = await apiFetch<FundResult>('/api/funds', {
    query: { month },
  });

  if (fundsResult.ok && fundsResult.data.length > 0) {
    return; // Already exists
  }

  // Create funds for current month with default dorm student template
  await apiFetch('/api/funds', {
    method: 'POST',
    body: {
      month,
      monthlyIncome: 5000000,
      residenceType: 'dorm',
    },
  });

  // Init daily food savings for the month
  const foodFund = fundsResult.ok
    ? fundsResult.data.find((f) => f.fundType === 'food')
    : null;

  const mainBudget = foodFund
    ? Math.round((Number(foodFund.allocatedAmount) * 0.9) / 30)
    : 80000;

  const snackBudget = foodFund
    ? Math.round((Number(foodFund.allocatedAmount) * 0.1) / 30)
    : 20000;

  await apiFetch('/api/daily-food/bulk', {
    method: 'POST',
    body: {
      month,
      budgetMain: mainBudget,
      budgetSub: snackBudget,
    },
  });

  // Ensure a weekly reward record exists for this week
  await apiFetch('/api/rewards/weekly', {
    method: 'POST',
    body: {
      weekStart: getWeekStart(),
      weekEnd: getWeekEnd(),
    },
  });
}

// ─── Public bootstrap entrypoint ─────────────────────────────────────────────

let bootstrapPromise: Promise<boolean> | null = null;

/**
 * Call this once on app mount (e.g. in layout.tsx or page.tsx).
 * Idempotent — repeated calls reuse the same in-flight promise.
 * Returns true if bootstrap was successful.
 */
export async function bootstrapAuth(): Promise<boolean> {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    let token = getStoredToken();
    const userId = getStoredUserId();

    const userBootstrapKey = userId ? `${BOOTSTRAP_DONE_KEY}:${userId}` : BOOTSTRAP_DONE_KEY;
    if (token && typeof window !== 'undefined' && window.sessionStorage.getItem(userBootstrapKey)) {
      return true;
    }

    if (!token && typeof window !== 'undefined' && window.sessionStorage.getItem(userBootstrapKey)) {
      return false;
    }

    if (!token) {
      const isMockMode = process.env.NEXT_PUBLIC_API_MODE === 'memory-mock';
      if (isMockMode) {
        // Try login first
        token = await loginDefault();

        // If login fails, try registering
        if (!token) {
          token = await registerDefault();
        }
      } else {
        // In production/deployment: redirect to /login
        if (typeof window !== 'undefined') {
          window.location.assign('/login');
        }
        return false;
      }
    }

    if (!token) {
      console.error('[Zuno] Bootstrap failed: could not authenticate default user');
      return false;
    }

    // Initialise resources for this user
    try {
      await initProfile();
      await initFundsForCurrentMonth();
    } catch (err) {
      console.warn('[Zuno] Bootstrap init warning:', err);
    }

    if (typeof window !== 'undefined') {
      const activeUserId = getStoredUserId() || 'default';
      window.sessionStorage.setItem(`${BOOTSTRAP_DONE_KEY}:${activeUserId}`, '1');
    }

    return true;
  })();

  return bootstrapPromise;
}
