# 🗄️ DATABASE SCHEMA — ZUNO
> **Phạm vi:** MVP — PostgreSQL (AWS RDS).  
> **Quy tắc đặt tên:** `[scope]_[object]_[attribute]` — không lặp từ đã có trong tên bảng.  
> **Kiểu chuỗi phân loại:** `VARCHAR(50)` — validate ở tầng Application, không dùng ENUM.  
> **Kiểu thời gian:** `TIMESTAMPTZ` — lưu kèm timezone, chuẩn UTC.

---

## 1. TỔNG QUAN KIẾN TRÚC

```
┌────────────────────────────────────────────────────────────┐
│                        ZUNO DATABASE                       │
├──────────────┬──────────────┬──────────────┬───────────────┤
│   User &     │    5-Fund    │ Transaction  │  Gamification │
│   Profile    │    System    │    Engine    │   & Rewards   │
│              │              │              │               │
│ users        │ funds        │ transactions │ weekly_rewards│
│ user_profiles│fund_templates│ transaction_ │ reward_points │
│              │fund_snapshots│ tags         │ daily_food_   │
│              │              │ ai_parse_logs│ savings       │
│              │              │              │overflow_events│
└──────────────┴──────────────┴──────────────┴───────────────┘
```

**4 nhóm — 12 bảng:**
1. **User & Profile** (2) — `users`, `user_profiles`
2. **5-Fund System** (3) — `fund_templates`, `funds`, `fund_snapshots`
3. **Transaction Engine** (3) — `transactions`, `transaction_tags`, `ai_parse_logs`
4. **Gamification & Rewards** (4) — `weekly_rewards`, `daily_food_savings`, `reward_points`, `overflow_events`

---

## 2. NHÓM 1: USER & PROFILE

### `users`

| Cột | Kiểu dữ liệu | Ghi chú |
|-----|-------------|---------|
| `id` | UUID (PK) | |
| `email` | VARCHAR(255) UNIQUE | |
| `password_hash` | TEXT | Bcrypt |
| `full_name` | VARCHAR(100) | |
| `avatar_url` | TEXT | |
| `is_active` | BOOLEAN DEFAULT true | Soft delete |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

---

### `user_profiles`

| Cột | Kiểu dữ liệu | Ghi chú |
|-----|-------------|---------|
| `id` | UUID (PK) | |
| `user_id` | UUID (FK → users) | |
| `residence_type` | VARCHAR(50) | `'rent'` / `'dorm'` |
| `monthly_income` | BIGINT | VND |
| `dorm_paid_semester` | BOOLEAN DEFAULT false | |
| `has_food_from_family` | BOOLEAN DEFAULT false | |
| `onboarding_completed` | BOOLEAN DEFAULT false | |
| `created_at` | TIMESTAMPTZ | |

---

## 3. NHÓM 2: HỆ THỐNG 5 QUỸ

### `fund_templates`


| Cột | Kiểu dữ liệu | Ghi chú |
|-----|-------------|---------|
| `id` | UUID (PK) | |
| `name` | VARCHAR(100) | e.g. "Rent Template" |
| `residence_type` | VARCHAR(50) | `'rent'` / `'dorm'` |
| `living_pct` | DECIMAL(5,2) | |
| `food_pct` | DECIMAL(5,2) | |
| `growth_pct` | DECIMAL(5,2) | |
| `experience_pct` | DECIMAL(5,2) | |
| `future_pct` | DECIMAL(5,2) | |
| `is_default` | BOOLEAN | |

**Seed data:**

| Template | living | food | growth | experience | future |
|----------|--------|------|--------|------------|--------|
| Rent | 40% | 20% | 15% | 10% | 15% |
| Dorm | 7.5% | 65% | 10% | 7.5% | 10% |

---

### `funds`


| Cột | Kiểu dữ liệu | Ghi chú |
|-----|-------------|---------|
| `id` | UUID (PK) | |
| `user_id` | UUID (FK → users) | |
| `month` | DATE | YYYY-MM-01 |
| `fund_type` | VARCHAR(50) | `'living'` / `'food'` / `'growth'` / `'experience'` / `'future'` |
| `allocated_amount` | BIGINT | VND — phân bổ đầu tháng |
| `spent_amount` | BIGINT | Tổng đã chi (cộng dồn) |
| `custom_percentage` | DECIMAL(5,2) | Override template |
| `is_locked` | BOOLEAN DEFAULT false | e.g. Future fund |
| `borrow_amount` | BIGINT DEFAULT 0 | Tổng đã mượn từ quỹ khác |
| `version` | INT DEFAULT 1 | Optimistic Locking |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

> **UNIQUE INDEX:** `(user_id, month, fund_type)`

---

### `fund_snapshots`

| Cột | Kiểu dữ liệu | Ghi chú |
|-----|-------------|---------|
| `id` | UUID (PK) | |
| `fund_id` | UUID (FK → funds) | |
| `snapshot_date` | DATE | |
| `remaining_amount` | BIGINT | Số dư tại thời điểm snapshot |
| `daily_drip_amount` | BIGINT | Tích lũy nhỏ giọt (Future fund) |

---

## 4. NHÓM 3: TRANSACTION ENGINE

### `transactions`

| Cột | Kiểu dữ liệu | Ghi chú |
|-----|-------------|---------|
| `id` | UUID (PK) | |
| `user_id` | UUID (FK → users) | |
| `fund_id` | UUID (FK → funds) | |
| `amount` | BIGINT | VND, luôn dương |
| `transaction_type` | VARCHAR(50) | `'expense'` / `'income'` / `'transfer'` / `'borrow'` |
| `category` | VARCHAR(100) | Tag danh mục |
| `description` | TEXT | Raw text từ user |
| `input_method` | VARCHAR(50) | `'manual'` / `'ai_text'` / `'ai_image'` |
| `ai_confidence` | DECIMAL(4,3) | 0.000 → 1.000 |
| `is_ai_corrected` | BOOLEAN DEFAULT false | Human-in-the-loop |
| `meal_type` | VARCHAR(50) | `'main'` / `'sub'` / NULL |
| `transaction_date` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |

> **INDEX:** `(user_id, transaction_date)`

---

### `transaction_tags`

| Cột | Kiểu dữ liệu | Ghi chú |
|-----|-------------|---------|
| `id` | UUID (PK) | |
| `name` | VARCHAR(100) | |
| `fund_type` | VARCHAR(50) | Quỹ mặc định |
| `icon_url` | TEXT | |
| `is_system` | BOOLEAN DEFAULT false | true = không xóa được |
| `user_id` | UUID (FK → users) | NULL nếu system tag |

---

### `ai_parse_logs`

| Cột | Kiểu dữ liệu | Ghi chú |
|-----|-------------|---------|
| `id` | UUID (PK) | |
| `user_id` | UUID (FK → users) | |
| `transaction_id` | UUID (FK → transactions) | NULL nếu chưa xác nhận |
| `raw_input` | TEXT | "Trà đá 10k" |
| `parsed_entity` | VARCHAR(200) | "Trà đá" |
| `parsed_amount` | BIGINT | 10000 |
| `parsed_category` | VARCHAR(100) | "food" |
| `user_correction` | JSONB | User sửa lại |
| `created_at` | TIMESTAMPTZ | |

---

## 5. NHÓM 4: GAMIFICATION & REWARDS

### `weekly_rewards`

| Cột | Kiểu dữ liệu | Ghi chú |
|-----|-------------|---------|
| `id` | UUID (PK) | |
| `user_id` | UUID (FK → users) | |
| `week_start` | DATE | Thứ 2 |
| `week_end` | DATE | Chủ nhật |
| `accumulated_savings` | BIGINT | Tổng tiền ăn dư trong tuần |
| `milestone_reached` | VARCHAR(50) | `'none'` / `'50k'` / `'100k'` / `'150k'` |
| `is_unlocked` | BOOLEAN DEFAULT false | |
| `unlocked_at` | TIMESTAMPTZ | |
| `points_earned` | INT DEFAULT 0 | |

---

### `daily_food_savings`


| Cột | Kiểu dữ liệu | Ghi chú |
|-----|-------------|---------|
| `id` | UUID (PK) | |
| `user_id` | UUID (FK → users) | |
| `date` | DATE | |
| `budget_main` | BIGINT | Ngân sách ăn chính trong ngày |
| `budget_sub` | BIGINT | Ngân sách ăn phụ trong ngày |
| `spent_main` | BIGINT | Đã chi ăn chính |
| `spent_sub` | BIGINT | Đã chi ăn phụ |
| `saved_amount` | BIGINT | = (budget_main + budget_sub) - (spent_main + spent_sub) |
| `daily_overflow` | BIGINT DEFAULT 0 | Số tiền tiêu lố |
| `penalty_applied_from_yesterday` | BIGINT DEFAULT 0 | Mức phạt tiền ăn phụ từ ngày trước |

> **UNIQUE INDEX:** `(user_id, date)`

---

### `reward_points`


| Cột | Kiểu dữ liệu | Ghi chú |
|-----|-------------|---------|
| `id` | UUID (PK) | |
| `user_id` | UUID (FK → users) | |
| `total` | INT DEFAULT 0 | Tổng điểm tích lũy |
| `multiplier` | DECIMAL(3,2) DEFAULT 1.00 | Hệ số nhân (giảm khi lố nặng) |
| `updated_at` | TIMESTAMPTZ | |

---

### `overflow_events` — Sổ cái ghi nợ

| Cột | Kiểu dữ liệu | Ghi chú |
|-----|-------------|---------|
| `id` | UUID (PK) | |
| `user_id` | UUID (FK → users) | |
| `transaction_id` | UUID (FK → transactions) | Giao dịch gây ra lố |
| `event_date` | DATE | |
| `overflow_level` | VARCHAR(50) | `'level_1'` / `'level_2'` / `'level_3'` |
| `overflow_amount` | BIGINT | Số tiền tiêu lố |
| `source_fund_type` | VARCHAR(50) | Quỹ bị ảnh hưởng đầu tiên |
| `borrowed_from_fund_type` | VARCHAR(50) | Quỹ bị mượn bù (NULL nếu không) |
| `repaid_amount` | BIGINT DEFAULT 0 | Đã bù lại |
| `status` | VARCHAR(50) DEFAULT 'pending' | `'pending'` / `'partial'` / `'repaid'` |
| `penalty_applied` | JSONB | Hình phạt |

---

## 6. SƠ ĐỒ QUAN HỆ (ERD)

```
users
 ├──< user_profiles             (1:1)
 ├──< funds                     (1:N — 5 quỹ × N tháng)
 │     └──< fund_snapshots      (1:N — snapshot mỗi ngày)
 ├──< transactions              (1:N)
 │     ├── fund_id → funds
 │     ├──< ai_parse_logs       (N:1 — mỗi log nối 1 transaction)
 │     └──< overflow_events     (1:N — 1 transaction có thể gây nhiều overflow)
 ├──< weekly_rewards            (1:N — mỗi tuần)
 ├──< daily_food_savings        (1:N — mỗi ngày)
 ├──< reward_points             (1:1)
 └──< overflow_events           (1:N)

fund_templates                  (Bảng độc lập — seed data)
transaction_tags                (Hệ thống + user tùy chỉnh)
```

---

## 7. GIÁ TRỊ VARCHAR HỢP LỆ (Validate ở Backend)

| Tên cột | Giá trị hợp lệ |
|---------|----------------|
| `residence_type` | `'rent'`, `'dorm'` |
| `fund_type` | `'living'`, `'food'`, `'growth'`, `'experience'`, `'future'` |
| `transaction_type` | `'expense'`, `'income'`, `'transfer'`, `'borrow'` |
| `input_method` | `'manual'`, `'ai_text'`, `'ai_image'` |
| `meal_type` | `'main'`, `'sub'` |
| `overflow_level` | `'level_1'`, `'level_2'`, `'level_3'` |
| `milestone_reached` | `'none'`, `'50k'`, `'100k'`, `'150k'` |
| `status` (overflow_events) | `'pending'`, `'partial'`, `'repaid'` |

---

## 8. GHI CHÚ KỸ THUẬT

- **Tiền tệ:** `BIGINT`, đơn vị VND.
- **Thời gian:** `TIMESTAMPTZ` — lưu kèm timezone, chuẩn UTC. Convert UTC+7 ở tầng ứng dụng.
- **Soft delete:** `users.is_active = false`.
- **Optimistic Locking:** `funds.version` +1 mỗi lần update, reject nếu version mismatch.
- **JSONB:** `penalty_applied`, `user_correction`.
- **Index:**
  - `funds(user_id, month, fund_type)` — UNIQUE
  - `transactions(user_id, transaction_date)`
  - `daily_food_savings(user_id, date)` — UNIQUE

---

## 9. CHANGELOG

| Ngày | Thay đổi |
|------|---------|
| 21/05 | Khởi tạo schema 12 bảng |
| 21/05 | ENUM → VARCHAR(50), TIMESTAMP → TIMESTAMPTZ |
| 21/05 | `fund_templates`: `fund_*_pct` → `*_pct` (khử lặp) |
| 21/05 | `daily_food_savings`: `budget_food_daily` → `budget_main` + `budget_sub`; `spent_food_*` → `spent_*`; `overflow_amount` → `daily_overflow`; xóa `week_reward_id`; thêm `penalty_applied_from_yesterday` |
| 21/05 | `reward_points`: `total_points` → `total`; `points_multiplier` → `multiplier` |
| 21/05 | `funds`: xóa `remaining_amount`, thêm `version` |
| 21/05 | `overflow_events`: thêm `transaction_id` FK, `repaid_amount`, `status`; đổi `source_fund` → `source_fund_type`, `borrowed_from_fund` → `borrowed_from_fund_type` |
| 21/05 | `ai_parse_logs`: thêm `transaction_id` FK |
| 24/05 | Đối chiếu thực tế và xác nhận code khớp hoàn toàn 100% với schema.prisma hiện tại |

