# K hoch Media Platform  CMS & Viewer Site

**Stack:** Vue 3 + Vuetify 3 + TypeScript + Pinia + Vue Router  
**Mc tiu:** Trang xem video (public) + Trang CMS qun l ni dung (admin)

---

## 1. Kin trc tng quan

```

                   Media Platform                    

  Viewer Site          CMS Admin (repo ny)         
  (trang xem video)    (qun l ni dung)           
  - Public             - Requires Auth              
  - Next.js / Nuxt     - Vue 3 + Vuetify 3          

```

---

## 2. Danh sch Pages CMS

### 2.1 Dashboard
| Page | Route | M t |
|------|-------|--------|
| Dashboard | `/dashboard` | Tng quan: video mi, lt xem, user mi, bo co ch x l |

**Widgets cn c:**
- Tng s video / video ang hot ng
- Tng lt xem trong 7/30 ngy
- User ng k mi
- Video c bo co ch duyt
- Biu  lt xem theo ngy (line chart)
- Top 5 video xem nhiu nht

---

### 2.2 Qun l Video
| Page | Route | M t |
|------|-------|--------|
| Danh sch video | `/videos` | Bng danh sch, filter, tm kim, phn trang |
| Thm video | `/videos/create` | Upload video, nhp metadata |
| Chnh sa video | `/videos/:id/edit` | Cp nht thng tin, thumbnail, trng thi |
| Chi tit video | `/videos/:id` | Xem thng tin, thng k lt xem/like, comments |

**Tnh nng trn trang danh sch:**
- Filter: trng thi (draft/published/blocked), danh mc, knh, ngy to
- Bulk action: publish, unpublish, xa
- Preview thumbnail inline

---

### 2.3 Qun l Danh mc (Categories)
| Page | Route | M t |
|------|-------|--------|
| Danh sch danh mc | `/categories` | Tree view h tr danh mc cha/con |
| Thm / Sa danh mc | `/categories/create`, `/categories/:id/edit` | Form tn, slug, nh i din, danh mc cha |

---

### 2.4 Qun l Tags
| Page | Route | M t |
|------|-------|--------|
| Danh sch tags | `/tags` | Bng danh sch + s video dng tag |
| Thm / Sa tag | inline trn trang danh sch | Quick edit |

---

### 2.5 Qun l Knh (Channels)
| Page | Route | M t |
|------|-------|--------|
| Danh sch knh | `/channels` | Tm kim, filter theo trng thi |
| Chi tit knh | `/channels/:id` | Thng tin knh, danh sch video, s subscriber |
| Thm / Sa knh | `/channels/create`, `/channels/:id/edit` | Form to/chnh sa knh |

---

### 2.6 Qun l Ngi dng (Users)
| Page | Route | M t |
|------|-------|--------|
| Danh sch user | `/users` | Bng danh sch, filter role/trng thi |
| Chi tit user | `/users/:id` | Lch s xem, knh s hu, bnh lun |
| Thm / Sa user | `/users/create`, `/users/:id/edit` | Form to/chnh sa ti khon |

---

### 2.7 Qun l Bnh lun (Comments)
| Page | Route | M t |
|------|-------|--------|
| Danh sch bnh lun | `/comments` | Filter theo video, user, trng thi (pending/approved/rejected) |

**Bulk action:** duyt, n, xa bnh lun

---

### 2.8 Qun l Bo co vi phm (Reports)
| Page | Route | M t |
|------|-------|--------|
| Danh sch bo co | `/reports` | Filter: loi (video/comment), trng thi (pending/resolved) |
| Chi tit bo co | `/reports/:id` | Xem ni dung b bo co, l do, hnh ng x l |

---

### 2.9 Qun l Playlist
| Page | Route | M t |
|------|-------|--------|
| Danh sch playlist | `/playlists` | Public / Private, sp xp theo user |
| Chi tit playlist | `/playlists/:id` | Danh sch video, cho php reorder hoc xa |

---

### 2.10 Qun l Qung co (Ads)
| Page | Route | M t |
|------|-------|--------|
| Danh sch qung co | `/ads` | Filter theo loi (pre-roll/banner/overlay), trng thi |
| Thm / Sa qung co | `/ads/create`, `/ads/:id/edit` | Ci t thi gian chy, target, creative |

---

### 2.11 Thng k & Analytics
| Page | Route | M t |
|------|-------|--------|
| Thng k video | `/analytics/videos` | Lt xem, watch time, retention theo video |
| Thng k user | `/analytics/users` | Tng trng user, retention |
| Thng k doanh thu | `/analytics/revenue` | Revenue t ads |

---

### 2.12 Ci t (Settings)
| Page | Route | M t |
|------|-------|--------|
| Ci t chung | `/settings/general` | Tn site, logo, m t, ngn ng mc nh |
| Ci t lu tr | `/settings/storage` | Cu hnh S3 / CDN / local storage |
| Ci t SEO | `/settings/seo` | Meta mc nh, sitemap, robots |
| Ci t email | `/settings/email` | SMTP, template email |
| Qun l admin | `/settings/admins` | Thm / phn quyn ti khon admin |

---

## 3. Database Schema

### 3.1 `users`
```sql
users (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  username      VARCHAR(50)  UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name  VARCHAR(100),
  avatar_url    VARCHAR(500),
  role          ENUM('viewer','creator','moderator','admin') DEFAULT 'viewer',
  status        ENUM('active','inactive','banned') DEFAULT 'active',
  email_verified_at TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

---

### 3.2 `categories`
```sql
categories (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  thumbnail   VARCHAR(500),
  parent_id   BIGINT NULL REFERENCES categories(id),
  sort_order  INT DEFAULT 0,
  status      ENUM('active','inactive') DEFAULT 'active',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

---

### 3.3 `tags`
```sql
tags (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

---

### 3.4 `channels`
```sql
channels (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id      BIGINT NOT NULL REFERENCES users(id),
  name         VARCHAR(200) NOT NULL,
  slug         VARCHAR(200) UNIQUE NOT NULL,
  description  TEXT,
  avatar_url   VARCHAR(500),
  cover_url    VARCHAR(500),
  subscribers  BIGINT DEFAULT 0,
  total_views  BIGINT DEFAULT 0,
  status       ENUM('active','inactive','suspended') DEFAULT 'active',
  verified_at  TIMESTAMP NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

---

### 3.5 `videos`
```sql
videos (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  channel_id      BIGINT NOT NULL REFERENCES channels(id),
  category_id     BIGINT NULL REFERENCES categories(id),
  title           VARCHAR(500) NOT NULL,
  slug            VARCHAR(500) UNIQUE NOT NULL,
  description     TEXT,
  thumbnail_url   VARCHAR(500),
  video_url       VARCHAR(500),   -- URL gc (S3 / CDN)
  duration        INT,            -- giy
  file_size       BIGINT,         -- bytes
  views_count     BIGINT DEFAULT 0,
  likes_count     BIGINT DEFAULT 0,
  dislikes_count  BIGINT DEFAULT 0,
  comments_count  BIGINT DEFAULT 0,
  is_featured     BOOLEAN DEFAULT FALSE,
  allow_comments  BOOLEAN DEFAULT TRUE,
  status          ENUM('draft','processing','published','unlisted','blocked') DEFAULT 'draft',
  published_at    TIMESTAMP NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_channel (channel_id),
  INDEX idx_category (category_id),
  INDEX idx_status_published (status, published_at),
  FULLTEXT idx_search (title, description)
)
```

---

### 3.6 `video_qualities`
```sql
video_qualities (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  video_id   BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  label      VARCHAR(20) NOT NULL,  -- '360p','720p','1080p','4K'
  file_url   VARCHAR(500) NOT NULL,
  file_size  BIGINT,
  bitrate    INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_video_quality (video_id, label)
)
```

---

### 3.7 `video_tags`
```sql
video_tags (
  video_id BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  tag_id   BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (video_id, tag_id)
)
```

---

### 3.8 `comments`
```sql
comments (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  video_id    BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id     BIGINT NOT NULL REFERENCES users(id),
  parent_id   BIGINT NULL REFERENCES comments(id),  -- reply
  content     TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  status      ENUM('pending','approved','rejected','deleted') DEFAULT 'approved',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_video (video_id),
  INDEX idx_parent (parent_id)
)
```

---

### 3.9 `playlists`
```sql
playlists (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT NOT NULL REFERENCES users(id),
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  thumbnail   VARCHAR(500),
  visibility  ENUM('public','unlisted','private') DEFAULT 'public',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### 3.10 `playlist_videos`
```sql
playlist_videos (
  playlist_id BIGINT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  video_id    BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  sort_order  INT DEFAULT 0,
  added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (playlist_id, video_id)
)
```

---

### 3.11 `watch_history`
```sql
watch_history (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id     BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  progress_sec INT DEFAULT 0,    -- thi im xem dng li (giy)
  completed    BOOLEAN DEFAULT FALSE,
  watched_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_video (user_id, video_id),
  INDEX idx_watched_at (watched_at)
)
```

---

### 3.12 `video_reactions`
```sql
video_reactions (
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id   BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  type       ENUM('like','dislike') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, video_id)
)
```

---

### 3.13 `channel_subscriptions`
```sql
channel_subscriptions (
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel_id BIGINT NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  notify     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, channel_id)
)
```

---

### 3.14 `reports`
```sql
reports (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  reporter_id  BIGINT NOT NULL REFERENCES users(id),
  video_id     BIGINT NULL REFERENCES videos(id),
  comment_id   BIGINT NULL REFERENCES comments(id),
  reason       ENUM('spam','violence','sexual','copyright','misinformation','other') NOT NULL,
  description  TEXT,
  status       ENUM('pending','reviewed','resolved','dismissed') DEFAULT 'pending',
  reviewed_by  BIGINT NULL REFERENCES users(id),
  reviewed_at  TIMESTAMP NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_video (video_id)
)
```

---

### 3.15 `ads`
```sql
ads (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  title        VARCHAR(200) NOT NULL,
  type         ENUM('pre_roll','mid_roll','banner','overlay') NOT NULL,
  creative_url VARCHAR(500) NOT NULL,
  target_url   VARCHAR(500),
  skip_after   INT NULL,           -- giy, NULL = khng b qua c
  impressions  BIGINT DEFAULT 0,
  clicks       BIGINT DEFAULT 0,
  start_date   DATE,
  end_date     DATE,
  status       ENUM('active','paused','expired') DEFAULT 'active',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

---

### 3.16 `video_views` *(analytics)*
```sql
video_views (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  video_id   BIGINT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id    BIGINT NULL REFERENCES users(id),
  ip_hash    VARCHAR(64),          -- hash IP cho anonymous viewer
  duration   INT DEFAULT 0,        -- giy thc s xem
  device     VARCHAR(50),
  country    CHAR(2),
  viewed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_video_date (video_id, viewed_at),
  INDEX idx_date (viewed_at)
)
```

---

### 3.17 `settings`
```sql
settings (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  `key`      VARCHAR(100) UNIQUE NOT NULL,
  value      TEXT,
  group      VARCHAR(50) NOT NULL DEFAULT 'general',  -- 'general','storage','seo','email'
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

---

## 4. Quan h gia cc bng (ERD tm tt)

```
users < channels < videos > categories
                          
                          < video_qualities
                          < video_tags > tags
                          < comments < comments (self-ref reply)
                          < video_reactions
                          < watch_history
                          < video_views

users < playlists < playlist_videos > videos
users < channel_subscriptions > channels
users < reports
```

---

## 5. Phn quyn

| Role | Dashboard | Video | Category | Channel | User | Comment | Report | Ads | Settings |
|------|-----------|-------|----------|---------|------|---------|--------|-----|----------|
| admin |  full |  full |  full |  full |  full |  full |  full |  full |  full |
| moderator |  read |  approve/block |  read |  read |  read |  full |  full |  |  |
| creator |  |  own |  |  own |  |  own video |  |  |  |

---

## 6. Th t u tin pht trin

### Phase 1  Core
1. Auth (Login / Logout / qun mt khu)
2. Dashboard overview
3. Qun l Category + Tag
4. Qun l Video (CRUD + upload)
5. Qun l Channel

### Phase 2  Interaction
6. Qun l User
7. Qun l Comment (duyt / xa)
8. Qun l Report (bo co vi phm)
9. Qun l Playlist

### Phase 3  Growth
10. Thng k & Analytics
11. Qun l Ads
12. Ci t h thng

---

## 7. Ghi ch k thut

- **Upload video:** dng multipart upload ln S3, transcode bng AWS MediaConvert hoc FFmpeg worker  cp nht `video_qualities`
- **CDN:** CloudFront / BunnyCDN phc v HLS stream (`.m3u8`)
- **Search:** Full-text search trn MySQL hoc tch hp Elasticsearch cho scale ln
- **Cache:** Redis cache `views_count`, `likes_count`  flush v DB nh k
- **Soft delete:** thm ct `deleted_at` cho `videos`, `comments`, `users` nu cn audit trail
