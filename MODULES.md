# Escore Backend - Complete Module Reference

This document provides comprehensive documentation for all 22 modules in the Escore Backend API.

> **Last Updated:** December 2024

---

## Table of Contents

1. [Auth Module](#1-auth-module)
2. [Users Module](#2-users-module)
3. [Admin Module](#3-admin-module)
4. [Games Module](#4-games-module)
5. [Teams Module](#5-teams-module)
6. [Players Module](#6-players-module)
7. [Tournaments Module](#7-tournaments-module)
8. [Matches Module](#8-matches-module)
9. [News Module](#9-news-module)
10. [Transfers Module](#10-transfers-module)
11. [Search Module](#11-search-module)
12. [Stats Module](#12-stats-module)
13. [Upload Module](#13-upload-module)
14. [Follows Module](#14-follows-module)
15. [Votes Module](#15-votes-module)
16. [Support Module](#16-support-module)
17. [Standings Module](#17-standings-module)
18. [Settings Module](#18-settings-module)
19. [Translations Module](#19-translations-module)
20. [Avatars Module](#20-avatars-module)
21. [Notifications Module](#21-notifications-module)

---

## 1. Auth Module

**Location**: `src/modules/auth/`

**Purpose**: User authentication, registration, email verification, password management, and admin account creation.

### Model Schema (User - defined in users module)

Authentication uses the User model with these auth-related fields:

| Field | Type | Description |
|-------|------|-------------|
| email | String | Unique email address (required) |
| password | String | Bcrypt hashed password (select: false) |
| appleId | String | Optional Apple Sign In ID |
| isVerified | Boolean | Email verification status |
| otp.code | String | Hashed OTP code |
| otp.type | String | 'verification' or 'reset' |
| otp.expiresAt | Date | OTP expiration timestamp |

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `register()` | email, password, firstName, lastName | User + token + permissions | Create user, send verification OTP |
| `login()` | email, password | User + token + permissions | Authenticate user credentials |
| `loginWithApple()` | appleId, email, firstName, lastName | User + token + permissions | Apple Sign In authentication |
| `verifyEmail()` | email, otp | User | Verify email with OTP code |
| `forgotPassword()` | email | void | Send password reset OTP |
| `resetPassword()` | email, otp, newPassword | void | Reset password with OTP |
| `resendOTP()` | email, type | void | Resend verification/reset OTP |
| `createAdmin()` | email, password, secretKey | User + token + permissions | Create admin account |
| `logout()` | userId | void | Logout user session |

### Response with Permissions

All authentication responses include user permissions:

```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "user" },
    "tokens": { "accessToken": "...", "refreshToken": "..." },
    "permissions": [
      { "entity": "News", "actions": ["create", "read", "update"] },
      { "entity": "Game", "actions": ["read"] }
    ]
  }
}
```

- **Admin users**: Returns all permissions for all entities
- **Regular users**: Returns only assigned permissions
- **New users**: Returns empty permissions array

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | None | User registration |
| POST | `/api/v1/auth/login` | None | User login |
| POST | `/api/v1/auth/login/apple` | None | Apple Sign In |
| POST | `/api/v1/auth/verify-email` | None | Verify email with OTP |
| POST | `/api/v1/auth/forgot-password` | None | Request password reset |
| POST | `/api/v1/auth/reset-password` | None | Reset password with OTP |
| POST | `/api/v1/auth/resend-otp` | None | Resend OTP code |
| POST | `/api/v1/auth/create-admin` | None (secret key) | Create admin account |
| POST | `/api/v1/auth/logout` | authenticate | Logout user |

### Notable Features

- OTP codes are SHA256 hashed before storage
- OTP expires after 10 minutes (configurable via OTP_EXPIRES_IN)
- JWT tokens have 7-day expiry (access) and 30-day (refresh)
- Admin creation requires ADMIN_SECRET_KEY environment variable
- Passwords must be at least 8 characters

---

## 2. Users Module

**Location**: `src/modules/users/`

**Purpose**: User profile management, role-based access control, and content creator workflow.

### Model Schema (IUser)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | Yes | Unique email address |
| password | String | Yes | Bcrypt hashed (select: false) |
| appleId | String | No | Apple Sign In ID |
| firstName | String | No | User's first name |
| lastName | String | No | User's last name |
| username | String | No | Unique username |
| avatar | ImageObject | No | Profile image (light/dark) |
| phone | String | No | Contact number |
| isVerified | Boolean | Yes | Email verified (default: false) |
| role | String | Yes | 'user' \| 'admin' \| 'content' \| 'support' |
| contentStatus | String | No | 'pending' \| 'approved' \| 'rejected' |
| contentRequestedAt | Date | No | When content role requested |
| contentApprovedAt | Date | No | When content role approved |
| contentApprovedBy | ObjectId | No | Admin who approved |
| contentRejectionReason | String | No | Reason for rejection |
| otp | Object | No | OTP subdocument |
| lastLogin | Date | No | Last login timestamp |
| isDeleted | Boolean | Yes | Soft delete flag (default: false) |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

**Virtual Fields:**
- `fullName` - Computed from firstName + lastName

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getProfile()` | userId | User + permissions | Get user profile with permissions |
| `updateProfile()` | userId, updateData | User + permissions | Update profile fields |
| `changePassword()` | userId, currentPassword, newPassword | void | Change user password |
| `deleteAccount()` | userId, password? | void | **Hard delete** user and all related data |
| `requestContentCreator()` | userId | User | Request content creator role |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/users/profile` | authenticate | Get current user profile (includes permissions) |
| PUT | `/api/v1/users/profile` | authenticate | Update profile (returns permissions) |
| PUT | `/api/v1/users/password` | authenticate | Change password |
| DELETE | `/api/v1/users/account` | authenticate | **Hard delete** account permanently |
| POST | `/api/v1/users/request-content` | authenticate | Request content creator status |

### Account Deletion

When a user deletes their account, it is a **hard delete** that permanently removes:
- User record
- Permissions
- Follows
- Votes
- Devices (FCM tokens)
- Support tickets

This allows the user to re-register with the same email/appleId later.

### Relationships

- `contentApprovedBy` → User (admin who approved)
- Referenced by: News (author), all entities (createdBy, updatedBy)

---

## 3. Admin Module

**Location**: `src/modules/admin/`

**Purpose**: Administrative dashboard, user management, and content creator approval workflow.

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getDashboardStats()` | - | DashboardStats | Platform statistics |
| `getUsers()` | filters, pagination | PaginatedUsers | List users with filters |
| `getUserById()` | userId | User | Get user details |
| `updateUser()` | userId, updateData | User | Update user role/status |
| `deleteUser()` | userId | void | Soft delete user |
| `getContentRequests()` | filters, pagination | PaginatedRequests | List pending requests |
| `approveContent()` | userId, adminId | User | Approve content creator |
| `rejectContent()` | userId, reason | User | Reject with reason |

### Dashboard Stats Response

```typescript
{
  users: {
    total: number,
    verified: number,
    unverified: number,
    deleted: number,
    byRole: {
      user: number,
      admin: number,
      content: number,
      support: number
    }
  },
  contentRequests: {
    pending: number,
    approved: number,
    rejected: number
  }
}
```

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/admin/dashboard` | requireAdmin | Dashboard statistics |
| GET | `/api/v1/admin/users` | requireAdmin | List all users |
| GET | `/api/v1/admin/users/:id` | requireAdmin | Get user details |
| PUT | `/api/v1/admin/users/:id` | requireAdmin | Update user |
| DELETE | `/api/v1/admin/users/:id` | requireAdmin | Soft delete user |
| GET | `/api/v1/admin/content-requests` | requireAdmin | List content requests |
| POST | `/api/v1/admin/content-requests/:id/approve` | requireAdmin | Approve request |
| POST | `/api/v1/admin/content-requests/:id/reject` | requireAdmin | Reject with reason |

---

## 4. Games Module

**Location**: `src/modules/games/`

**Purpose**: Core esports games management (e.g., League of Legends, Counter-Strike 2, Valorant).

### Model Schema (IGame)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Game title |
| slug | String | Yes | URL-friendly identifier (auto-generated, unique) |
| description | String | No | Game details |
| logo | ImageObject | No | Game logo (light/dark) |
| coverImage | ImageObject | No | Cover image (light/dark) |
| releaseDate | Date | No | Game release date |
| isActive | Boolean | Yes | Enable/disable game (default: true) |
| followersCount | Number | Yes | Number of followers (default: 0) |
| createdBy | ObjectId | No | User who created |
| updatedBy | ObjectId | No | User who last updated |
| isDeleted | Boolean | Yes | Soft delete flag |

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `create()` | gameData, userId | Game | Create new game |
| `findAll()` | filters, pagination | PaginatedGames | List games with filters |
| `findById()` | gameId, userId? | Game | Get game details (with isFollowed) |
| `findBySlug()` | slug, userId? | Game | Get game by slug |
| `update()` | gameId, updateData, userId | Game | Update game |
| `delete()` | gameId | void | Soft delete game |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/games` | optionalAuth | List all games |
| GET | `/api/v1/games/:id` | optionalAuth | Get game by ID |
| GET | `/api/v1/games/slug/:slug` | optionalAuth | Get game by slug |
| POST | `/api/v1/games` | requireContentOrAdmin | Create game |
| PUT | `/api/v1/games/:id` | requireContentOrAdmin | Update game |
| DELETE | `/api/v1/games/:id` | requireAdmin | Delete game |

### Relationships

- **Has many** Teams (via Team.games[])
- **Has many** Players (via Player.game)
- **Has many** Tournaments (via Tournament.games[])
- Referenced by: Matches, News, Transfers

### Indexes

- `slug` (unique)
- `isActive + isDeleted` (compound)
- Full-text search on name, description

---

## 5. Teams Module

**Location**: `src/modules/teams/`

**Purpose**: Team management with multi-game support, regions, and player rosters. Teams can compete in one or multiple games (e.g., multi-game esports organizations like Team Liquid, FaZe Clan).

### Model Schema (ITeam)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Team name |
| slug | String | Yes | URL-friendly identifier (auto-generated, unique) |
| shortName | String | No | 3-10 character abbreviation |
| description | String | No | Team information |
| logo | ImageObject | No | Team logo (light/dark) |
| coverImage | ImageObject | No | Cover image (light/dark) |
| country | CountryObject | No | {name, code, flag} |
| region | String | No | Geographic region |
| founded | Date | No | Team founding date |
| games | [ObjectId] | Yes | References to Games (at least one) |
| socialLinks | Object | No | Twitter, Facebook, Instagram, YouTube, Twitch, Discord, website |
| isActive | Boolean | Yes | Enable/disable (default: true) |
| sortOrder | Number | No | Display ordering |
| followersCount | Number | Yes | Number of followers (default: 0) |
| createdBy | ObjectId | No | User who created |
| updatedBy | ObjectId | No | User who last updated |
| isDeleted | Boolean | Yes | Soft delete flag |

### Response Fields (Additional)

When fetching a single team (by ID or slug), the response includes:

| Field | Type | Description |
|-------|------|-------------|
| tournaments | TeamTournamentInfo[] | Tournaments the team participates in, with associated game info |
| ranking | number \| null | Team's best position from standings (null if no standings) |
| awardsNumber | number | Total count of awards won by the team |

**TeamTournamentInfo structure:**
```typescript
{
  _id: ObjectId;
  name: string;
  slug: string;
  logo?: ImageObject;
  status: string;        // 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  startDate: Date;
  endDate: Date;
  game: {               // Primary game for the tournament
    _id: ObjectId;
    name: string;
    slug: string;
    logo?: ImageObject;
  } | null;
}
```

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `create()` | teamData, userId | Team | Create team (validates game exists) |
| `findAll()` | filters, pagination | PaginatedTeams | List with filters |
| `findById()` | teamId, userId? | TeamResponse | Get team with tournaments, ranking, awardsNumber |
| `findBySlug()` | slug, userId? | TeamResponse | Get team with tournaments, ranking, awardsNumber |
| `findByGame()` | gameId, pagination, userId? | PaginatedTeams | Teams for specific game |
| `update()` | teamId, updateData, userId | Team | Update team |
| `delete()` | teamId | void | Soft delete team |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/teams` | optionalAuth | List all teams |
| GET | `/api/v1/teams/:id` | optionalAuth | Get team by ID (includes tournaments, ranking, awardsNumber) |
| GET | `/api/v1/teams/slug/:slug` | optionalAuth | Get team by slug (includes tournaments, ranking, awardsNumber) |
| GET | `/api/v1/teams/game/:gameId` | optionalAuth | Teams for game |
| POST | `/api/v1/teams` | requireContentOrAdmin | Create team |
| PUT | `/api/v1/teams/:id` | requireContentOrAdmin | Update team |
| DELETE | `/api/v1/teams/:id` | requireAdmin | Delete team |

### Relationships

- `games[]` → Games (required, at least one)
- `tournaments` → Tournaments (derived from Tournament.teams, includes game info)
- `ranking` → Standing.position (best position across all tournaments)
- `awards[]` → Awards with game reference
- Players belong to teams (via player.team)
- Referenced by: Matches, Tournaments, Transfers, Standings

---

## 6. Players Module

**Location**: `src/modules/players/`

**Purpose**: Individual player management with team associations and stats.

### Model Schema (IPlayer)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| nickname | String | Yes | In-game name (unique slug generated) |
| slug | String | Yes | URL-friendly identifier |
| firstName | String | No | Real first name |
| lastName | String | No | Real last name |
| bio | String | No | Player biography |
| photo | ImageObject | No | Player photo (light/dark) |
| coverImage | ImageObject | No | Cover image (light/dark) |
| country | CountryObject | No | {name, code, flag} |
| dateOfBirth | Date | No | For age calculation |
| role | String | No | In-game role (e.g., "AWPer", "Mid Laner") |
| game | ObjectId | Yes | Reference to Game |
| team | ObjectId | No | Reference to Team |
| socialLinks | Object | No | Twitter, Instagram, Twitch, YouTube |
| stats | Object | No | {gamesPlayed, wins, losses, winRate} |
| isActive | Boolean | Yes | Player active status |
| isFreeAgent | Boolean | Yes | Auto-set based on team assignment |
| followersCount | Number | Yes | Follower count (default: 0) |
| createdBy | ObjectId | No | User who created |
| updatedBy | ObjectId | No | User who last updated |
| isDeleted | Boolean | Yes | Soft delete flag |

**Virtual Fields:**
- `fullName` - Computed from firstName + lastName

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `create()` | playerData, userId | Player | Create player (validates game/team match) |
| `findAll()` | filters, pagination | PaginatedPlayers | List with filters |
| `findById()` | playerId, userId? | Player | Get player details |
| `findBySlug()` | slug, userId? | Player | Get player by slug |
| `findByGame()` | gameId, pagination | PaginatedPlayers | Players for game |
| `findByTeam()` | teamId, pagination | PaginatedPlayers | Players for team |
| `findFreeAgents()` | gameId?, pagination | PaginatedPlayers | List free agents |
| `update()` | playerId, updateData, userId | Player | Update player |
| `delete()` | playerId | void | Soft delete player |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/players` | optionalAuth | List all players |
| GET | `/api/v1/players/:id` | optionalAuth | Get player by ID |
| GET | `/api/v1/players/slug/:slug` | optionalAuth | Get player by slug |
| GET | `/api/v1/players/game/:gameId` | optionalAuth | Players for game |
| GET | `/api/v1/players/team/:teamId` | optionalAuth | Players for team |
| GET | `/api/v1/players/free-agents` | optionalAuth | List free agents |
| POST | `/api/v1/players` | requireContentOrAdmin | Create player |
| PUT | `/api/v1/players/:id` | requireContentOrAdmin | Update player |
| DELETE | `/api/v1/players/:id` | requireAdmin | Delete player |

### Relationships

- `game` → Game (required)
- `team` → Team (optional, sets isFreeAgent status)
- Referenced by: Match lineups, Transfers

---

## 7. Tournaments Module

**Location**: `src/modules/tournaments/`

**Purpose**: Tournament and competition management with status tracking. Tournaments can span one or multiple games (e.g., multi-game esports festivals).

### Model Schema (ITournament)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Tournament name |
| slug | String | Yes | URL-friendly identifier |
| description | String | No | Tournament details |
| logo | ImageObject | No | Tournament logo |
| coverImage | ImageObject | No | Cover image |
| bracketImage | ImageObject | No | Bracket image |
| games | [ObjectId] | Yes | References to Games (at least one) |
| organizer | String | No | Tournament organizer |
| country | CountryObject | No | {name, code, flag} |
| location | String | No | Venue location |
| isOnline | Boolean | Yes | Online vs offline (default: false) |
| startDate | Date | Yes | Tournament start |
| endDate | Date | Yes | Tournament end |
| registrationStartDate | Date | No | Registration opens |
| registrationEndDate | Date | No | Registration closes |
| prizePool | Number | No | Total prize money |
| currency | String | No | Prize currency (default: USD) |
| prizeDistribution | Array | No | [{place, amount, team?}] |
| teams | [ObjectId] | No | Participating team IDs |
| maxTeams | Number | No | Maximum team capacity |
| status | String | Auto | 'upcoming' \| 'ongoing' \| 'completed' \| 'cancelled' |
| tier | String | No | S-Tier, A-Tier, Major, Minor |
| format | String | No | Double Elimination, Round Robin, etc. |
| rules | String | No | Tournament rules text |
| streamUrl | String | No | Stream URL |
| websiteUrl | String | No | Official website |
| isActive | Boolean | Yes | Enable/disable |
| isFeatured | Boolean | Yes | Feature flag |
| followersCount | Number | Yes | Follower count |
| viewsCount | Number | Yes | View counter |
| createdBy | ObjectId | No | User who created |
| updatedBy | ObjectId | No | User who last updated |
| isDeleted | Boolean | Yes | Soft delete flag |

**Pre-save Logic:**
- Auto-calculate status based on current date vs startDate/endDate
- Generate slug from name

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `create()` | tournamentData, userId | Tournament | Create tournament |
| `findAll()` | filters, pagination | PaginatedTournaments | List with filters |
| `findById()` | tournamentId, userId? | Tournament | Get tournament details |
| `findBySlug()` | slug, userId? | Tournament | Get by slug |
| `findByGame()` | gameId, pagination | PaginatedTournaments | Tournaments including this game |
| `findFeatured()` | limit? | Tournament[] | Featured tournaments |
| `findUpcoming()` | gameId?, limit? | Tournament[] | Upcoming tournaments |
| `findOngoing()` | gameId?, limit? | Tournament[] | Ongoing tournaments |
| `update()` | tournamentId, updateData, userId | Tournament | Update tournament |
| `addTeam()` | tournamentId, teamId | Tournament | Register team |
| `removeTeam()` | tournamentId, teamId | Tournament | Unregister team |
| `delete()` | tournamentId | void | Soft delete |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/tournaments` | optionalAuth | List tournaments |
| GET | `/api/v1/tournaments/:id` | optionalAuth | Get tournament |
| GET | `/api/v1/tournaments/slug/:slug` | optionalAuth | Get by slug |
| GET | `/api/v1/tournaments/game/:gameId` | optionalAuth | Tournaments including this game |
| GET | `/api/v1/tournaments/featured` | optionalAuth | Featured tournaments |
| GET | `/api/v1/tournaments/upcoming` | optionalAuth | Upcoming tournaments |
| GET | `/api/v1/tournaments/ongoing` | optionalAuth | Ongoing tournaments |
| POST | `/api/v1/tournaments` | requireContentOrAdmin | Create tournament |
| PUT | `/api/v1/tournaments/:id` | requireContentOrAdmin | Update tournament |
| POST | `/api/v1/tournaments/:id/teams/:teamId` | requireContentOrAdmin | Add team |
| DELETE | `/api/v1/tournaments/:id/teams/:teamId` | requireContentOrAdmin | Remove team |
| DELETE | `/api/v1/tournaments/:id` | requireAdmin | Delete tournament |

### Relationships

- `games[]` → Games (required, at least one)
- `teams[]` → Teams
- `prizeDistribution[].team` → Team (optional)
- Referenced by: Matches, Standings, News

---

## 8. Matches Module

**Location**: `src/modules/matches/`

**Purpose**: Match scheduling, live scores, results, and lineups.

### Model Schema (IMatch)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| game | ObjectId | Yes | Reference to Game |
| tournament | ObjectId | No | Reference to Tournament |
| team1 | ObjectId | Yes | First team |
| team2 | ObjectId | Yes | Second team (must differ from team1) |
| scheduledDate | Date | Yes | Match scheduled time |
| startedAt | Date | No | Actual start time |
| endedAt | Date | No | Actual end time |
| status | String | Yes | 'scheduled' \| 'live' \| 'completed' \| 'postponed' \| 'cancelled' |
| result | Object | No | {team1Score, team2Score, winner, maps[]} |
| result.maps[] | Array | No | [{mapName, team1Score, team2Score, winner}] |
| round | String | No | Tournament round name |
| matchNumber | Number | No | Sequential match number |
| bestOf | Number | No | Best of 1, 3, 5, etc. |
| streamUrl | String | No | Stream URL |
| highlightsUrl | String | No | Highlights video |
| venue | String | No | Physical venue |
| isOnline | Boolean | Yes | Online vs offline |
| isFeatured | Boolean | Yes | Feature flag |
| lineups | Array | No | [{team, players[]}] |
| viewsCount | Number | Yes | View counter |
| createdBy | ObjectId | No | User who created |
| updatedBy | ObjectId | No | User who last updated |
| isDeleted | Boolean | Yes | Soft delete flag |

### Response Fields (Lineup Details)

When fetching a match by ID, the `lineups` field returns complete team and player information:

**CompleteLineup structure:**
```typescript
{
  team: {
    _id: ObjectId;
    name: string;
    slug: string;
    shortName?: string;
    logo?: ImageObject;
  };
  players: Array<{
    _id: ObjectId;
    nickname: string;
    slug: string;
    firstName?: string;
    lastName?: string;
    photo?: ImageObject;
    role?: string;
    country?: CountryObject;
  }>;
}
```

**Example response:**
```json
{
  "lineups": [
    {
      "team": {
        "_id": "...",
        "name": "T1",
        "slug": "t1",
        "shortName": "T1",
        "logo": { "light": "...", "dark": "..." }
      },
      "players": [
        {
          "_id": "...",
          "nickname": "Faker",
          "slug": "faker",
          "firstName": "Sang-hyeok",
          "lastName": "Lee",
          "role": "Mid",
          "country": { "name": "South Korea", "code": "KR", "flag": "🇰🇷" }
        }
      ]
    }
  ]
}
```

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `create()` | matchData, userId | Match | Create match |
| `findAll()` | filters, pagination | PaginatedMatches | List matches |
| `findById()` | matchId, userId? | Match | Get match details |
| `findByGame()` | gameId, pagination | PaginatedMatches | Matches for game |
| `findByTournament()` | tournamentId, pagination | PaginatedMatches | Matches for tournament |
| `findByTeam()` | teamId, pagination | PaginatedMatches | Team's matches |
| `findLive()` | gameId?, limit? | Match[] | Live matches |
| `findUpcoming()` | gameId?, limit? | Match[] | Upcoming matches |
| `findRecent()` | gameId?, limit? | Match[] | Recent completed |
| `update()` | matchId, updateData, userId | Match | Update match |
| `setLineup()` | matchId, teamId, playerIds | Match | Set team lineup |
| `setResult()` | matchId, resultData | Match | Record result |
| `delete()` | matchId | void | Soft delete |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/matches` | optionalAuth | List matches |
| GET | `/api/v1/matches/:id` | optionalAuth | Get match |
| GET | `/api/v1/matches/game/:gameId` | optionalAuth | Matches for game |
| GET | `/api/v1/matches/tournament/:tournamentId` | optionalAuth | Matches for tournament |
| GET | `/api/v1/matches/team/:teamId` | optionalAuth | Team's matches |
| GET | `/api/v1/matches/live` | optionalAuth | Live matches |
| GET | `/api/v1/matches/upcoming` | optionalAuth | Upcoming matches |
| GET | `/api/v1/matches/recent` | optionalAuth | Recent matches |
| POST | `/api/v1/matches` | requireContentOrAdmin | Create match |
| PUT | `/api/v1/matches/:id` | requireContentOrAdmin | Update match |
| PUT | `/api/v1/matches/:id/lineup` | requireContentOrAdmin | Set lineup |
| PUT | `/api/v1/matches/:id/result` | requireContentOrAdmin | Set result |
| DELETE | `/api/v1/matches/:id` | requireAdmin | Delete match |

### Relationships

- `game` → Game
- `tournament` → Tournament (optional)
- `team1`, `team2` → Teams
- `result.winner` → Team
- `lineups[].team` → Team
- `lineups[].players[]` → Players
- Referenced by: Votes, News

---

## 9. News Module

**Location**: `src/modules/news/`

**Purpose**: Content publishing, news articles, and engagement tracking.

### Model Schema (INews)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Article title |
| slug | String | Yes | URL-friendly identifier |
| excerpt | String | No | Short summary |
| content | String | Yes | Full article content |
| coverImage | ImageObject | No | Featured image |
| category | String | Yes | news, announcement, interview, analysis, guide, review, opinion |
| tags | [String] | No | Searchable tags |
| game | ObjectId | No | Related game |
| tournament | ObjectId | No | Related tournament |
| team | ObjectId | No | Related team |
| player | ObjectId | No | Related player |
| match | ObjectId | No | Related match |
| authorName | String | No | Author display name |
| authorImage | ImageObject | No | Author image (light/dark) |
| urlExternal | String | No | External source URL |
| isPublished | Boolean | Yes | Publication status |
| publishedAt | Date | No | Auto-set when published |
| isFeatured | Boolean | Yes | Feature flag |
| isPinned | Boolean | Yes | Pin to top |
| viewsCount | Number | Yes | View counter |
| likesCount | Number | Yes | Like counter |
| commentsCount | Number | Yes | Comment counter |
| readTime | Number | Auto | Auto-calculated reading time (minutes) |
| isActive | Boolean | Yes | Draft/active flag |
| createdBy | ObjectId | No | User who created |
| updatedBy | ObjectId | No | User who last updated |
| isDeleted | Boolean | Yes | Soft delete flag |

**Pre-save Logic:**
- Generate slug from title
- Calculate readTime (word count / 200 WPM)
- Set publishedAt when publishing

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `create()` | newsData, userId | News | Create article |
| `findAll()` | filters, pagination | PaginatedNews | List articles |
| `findPublished()` | filters, pagination | PaginatedNews | Published only |
| `findById()` | newsId | News | Get article |
| `findBySlug()` | slug | News | Get by slug (increments views) |
| `findByGame()` | gameId, pagination | PaginatedNews | News for game |
| `findFeatured()` | limit? | News[] | Featured articles |
| `findLatest()` | limit? | News[] | Latest articles |
| `findMyNews()` | userId, pagination | PaginatedNews | User's articles |
| `update()` | newsId, updateData, userId | News | Update article |
| `publish()` | newsId | News | Publish article |
| `unpublish()` | newsId | News | Unpublish article |
| `toggleFeatured()` | newsId | News | Toggle featured |
| `togglePinned()` | newsId | News | Toggle pinned |
| `delete()` | newsId | void | Soft delete |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/news/published` | optionalAuth | Published articles |
| GET | `/api/v1/news/featured` | None | Featured articles |
| GET | `/api/v1/news/latest` | None | Latest articles |
| GET | `/api/v1/news/game/:gameId` | optionalAuth | News for game |
| GET | `/api/v1/news/slug/:slug` | None | Get by slug |
| GET | `/api/v1/news/my` | requireContentOrAdmin | User's articles |
| GET | `/api/v1/news/:id` | optionalAuth | Get article |
| POST | `/api/v1/news` | requireContentOrAdmin | Create article |
| PUT | `/api/v1/news/:id` | requireContentOrAdmin | Update article |
| PATCH | `/api/v1/news/:id/publish` | requireContentOrAdmin | Publish |
| PATCH | `/api/v1/news/:id/unpublish` | requireContentOrAdmin | Unpublish |
| PATCH | `/api/v1/news/:id/toggle-featured` | requireContentOrAdmin | Toggle featured |
| PATCH | `/api/v1/news/:id/toggle-pinned` | requireContentOrAdmin | Toggle pinned |
| DELETE | `/api/v1/news/:id` | requireContentOrAdmin | Delete article |

### Relationships

- `game` → Game (optional)
- `tournament` → Tournament (optional)
- `team` → Team (optional)
- `player` → Player (optional)
- `match` → Match (optional)

---

## 10. Transfers Module

**Location**: `src/modules/transfers/`

**Purpose**: Track player transfers, loans, free agent moves, and retirements.

### Model Schema (ITransfer)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| player | ObjectId | Yes | Player being transferred |
| fromTeam | ObjectId | No | Origin team |
| toTeam | ObjectId | No | Destination team |
| game | ObjectId | No | Game context |
| type | String | Yes | transfer, loan, free_agent, retirement, return_from_loan |
| status | String | Yes | rumor, pending, confirmed, cancelled |
| isFeatured | Boolean | Yes | Feature flag (default: false) |
| fee | Number | No | Transfer fee |
| currency | String | No | Currency (default: USD) |
| contractLength | Number | No | Contract length in months |
| announcedAt | Date | No | Auto-set when confirmed |
| effectiveDate | Date | No | When transfer takes effect |
| endDate | Date | No | End date (for loans) |
| source | String | No | News source |
| notes | String | No | Additional notes |
| isActive | Boolean | Yes | Enable/disable |
| createdBy | ObjectId | No | User who created |
| updatedBy | ObjectId | No | User who last updated |
| isDeleted | Boolean | Yes | Soft delete flag |

**Validation:**
- At least one of fromTeam/toTeam required (except retirement)

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `create()` | transferData, userId | Transfer | Create transfer |
| `findAll()` | filters, pagination | PaginatedTransfers | List transfers |
| `findById()` | transferId | Transfer | Get transfer |
| `findRecent()` | limit? | Transfer[] | Recent confirmed |
| `findRumors()` | pagination | PaginatedTransfers | Unconfirmed |
| `findByPlayer()` | playerId, pagination | PaginatedTransfers | Player's history |
| `findByTeam()` | teamId, pagination | PaginatedTransfers | Team's transfers |
| `update()` | transferId, updateData, userId | Transfer | Update transfer |
| `updateStatus()` | transferId, status | Transfer | Change status |
| `confirm()` | transferId | Transfer | Confirm and update player |
| `delete()` | transferId | void | Soft delete |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/transfers` | optionalAuth | List transfers |
| GET | `/api/v1/transfers/recent` | None | Recent confirmed |
| GET | `/api/v1/transfers/rumors` | None | Transfer rumors |
| GET | `/api/v1/transfers/player/:playerId` | optionalAuth | Player's transfers |
| GET | `/api/v1/transfers/team/:teamId` | optionalAuth | Team's transfers |
| GET | `/api/v1/transfers/:id` | optionalAuth | Get transfer |
| POST | `/api/v1/transfers` | requireContentOrAdmin | Create transfer |
| PUT | `/api/v1/transfers/:id` | requireContentOrAdmin | Update transfer |
| PATCH | `/api/v1/transfers/:id/status` | requireContentOrAdmin | Update status |
| PATCH | `/api/v1/transfers/:id/confirm` | requireContentOrAdmin | Confirm transfer |
| DELETE | `/api/v1/transfers/:id` | requireAdmin | Delete transfer |

### Relationships

- `player` → Player (required)
- `fromTeam`, `toTeam` → Teams
- `game` → Game (optional)

### Notable Features

- Status workflow: rumor → pending → confirmed/cancelled
- Auto-sets announcedAt when confirmed
- Updates player's team and isFreeAgent on confirmation
- Handles retirement (no toTeam) and free agency

---

## 11. Search Module

**Location**: `src/modules/search/`

**Purpose**: Unified global search across all entities with autocomplete.

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `search()` | query, types?, gameId?, limit? | SearchResults | Global search |
| `autocomplete()` | query, limit? | SearchResults | Quick suggestions |
| `searchByGame()` | gameId, query, limit? | SearchResults | Search within game |

### Search Results Structure

```typescript
{
  query: string,
  total: number,
  results: SearchResultItem[],
  groups: {
    games: SearchResultItem[],
    teams: SearchResultItem[],
    players: SearchResultItem[],
    tournaments: SearchResultItem[],
    matches: SearchResultItem[],
    news: SearchResultItem[]
  }
}
```

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/search` | None | Global search |
| GET | `/api/v1/search/autocomplete` | None | Autocomplete suggestions |
| GET | `/api/v1/search/game/:gameId` | None | Search within game |

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| q | String | Required | Search query (min 2 chars) |
| types | String | All | Comma-separated types |
| game | String | None | Filter by game ID |
| limit | Number | 10 | Results per type (max 20) |

### Notable Features

- Case-insensitive regex matching
- Parallel queries for performance
- Minimum 2 characters required
- Grouped results by entity type
- Autocomplete limited to 3 per type (max 8 total)
- Includes metadata (game context, team affiliations)

---

## 12. Stats Module

**Location**: `src/modules/stats/`

**Purpose**: Platform statistics and analytics.

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getPlatformStats()` | - | PlatformStats | Overall platform stats |
| `getGameStats()` | gameId | GameStats | Game-specific stats |
| `getTournamentStats()` | tournamentId | TournamentStats | Tournament stats |
| `getTeamStats()` | teamId | TeamStats | Team performance |
| `getTrending()` | - | TrendingItems | Trending content |
| `getOverview()` | - | Overview | Combined stats + trending |

### Response Types

```typescript
// Platform Stats
{
  games: { total, active },
  teams: number,
  players: number,
  tournaments: { total, active },
  matches: { total, live, upcoming },
  news: number,
  transfers: number
}

// Team Stats
{
  playerCount: number,
  matchRecord: {
    wins: number,
    losses: number,
    draws: number,
    total: number
  },
  winRate: number,
  recentForm: string[] // ['W', 'L', 'W', 'W', 'D']
}
```

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/stats` | None | Platform stats |
| GET | `/api/v1/stats/overview` | None | Stats + trending |
| GET | `/api/v1/stats/trending` | None | Trending items |
| GET | `/api/v1/stats/game/:gameId` | None | Game stats |
| GET | `/api/v1/stats/tournament/:tournamentId` | None | Tournament stats |
| GET | `/api/v1/stats/team/:teamId` | None | Team stats |

---

## 13. Upload Module

**Location**: `src/modules/upload/`

**Purpose**: Image file upload handling.

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `uploadImage()` | file, folder? | UploadResult | Upload single image |
| `uploadImages()` | files[], folder? | UploadResult[] | Upload multiple images |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/upload/image` | authenticate | Upload single image |
| POST | `/api/v1/upload/images` | authenticate | Upload multiple (max 10) |

### Request Format

- Content-Type: `multipart/form-data`
- Field names: `image` (single) or `images` (multiple)
- Optional: `folder` field for subfolder organization

### Response Format

```typescript
{
  path: "/uploads/folder/filename.jpg",
  url: "http://localhost:5000/uploads/folder/filename.jpg"
}
```

### Notable Features

- Supported formats: jpg, jpeg, png, gif, webp
- Max file size: 5MB (configurable via MAX_FILE_SIZE)
- Timestamped filenames for uniqueness
- Subfolder organization support

---

## 14. Follows Module

**Location**: `src/modules/follows/`

**Purpose**: User follow system for games, teams, players, and tournaments.

### Model Schema (IFollow)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user | ObjectId | Yes | User following |
| targetType | String | Yes | 'game' \| 'team' \| 'player' \| 'tournament' |
| targetId | ObjectId | Yes | ID of followed entity |
| createdAt | Date | Auto | Follow timestamp |

**Unique Constraint:** (user, targetType, targetId)

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `follow()` | userId, targetType, targetId | Follow | Follow target |
| `unfollow()` | userId, targetType, targetId | void | Unfollow target |
| `checkFollowStatus()` | userId, targetType, targetId | FollowStatus | Check if following |
| `getUserFollows()` | userId, filters, pagination | PaginatedFollows | User's follows |
| `getUserFollowsByType()` | userId, targetType, pagination | PaginatedFollows | Follows by type |
| `getUserFollowCounts()` | userId | FollowCounts | Count by type |
| `getFollowedIds()` | userId, targetType | string[] | IDs of followed items |
| `getFollowedIdsSet()` | userId, targetType | Set<string> | Efficient bulk lookup |
| `isFollowing()` | userId?, targetType, targetId | boolean | Quick check |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/follows` | authenticate | Follow target |
| DELETE | `/api/v1/follows/:targetType/:targetId` | authenticate | Unfollow target |
| GET | `/api/v1/follows` | authenticate | User's follows |
| GET | `/api/v1/follows/counts` | authenticate | Follow counts |
| GET | `/api/v1/follows/games` | authenticate | Followed games |
| GET | `/api/v1/follows/teams` | authenticate | Followed teams |
| GET | `/api/v1/follows/players` | authenticate | Followed players |
| GET | `/api/v1/follows/tournaments` | authenticate | Followed tournaments |
| GET | `/api/v1/follows/status/:targetType/:targetId` | authenticate | Check status |

### Side Effects

- Increments `followersCount` on target entity when following
- Decrements `followersCount` when unfollowing
- Updates Game, Team, Player, Tournament models

### Response Enhancement

- All list endpoints include `isFollowed: boolean` for authenticated users
- Followed items appear first in list responses (sorted by isFollowed)

---

## 15. Votes Module

**Location**: `src/modules/votes/`

**Purpose**: Match prediction voting system.

### Model Schema (IVote)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user | ObjectId | Yes | User voting |
| match | ObjectId | Yes | Match being voted on |
| vote | String | Yes | 'team1' \| 'team2' \| 'draw' |
| createdAt | Date | Auto | Vote timestamp |
| updatedAt | Date | Auto | Last update |

**Unique Constraint:** (user, match)

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `castVote()` | userId, matchId, vote | Vote | Create/update vote |
| `removeVote()` | userId, matchId | void | Remove vote |
| `getVoteCounts()` | matchId | VoteCounts | Counts per option |
| `getVotePercentages()` | matchId | VotePercentages | Percentages |
| `getMatchVoteStats()` | matchId, userId? | MatchVoteStats | Full stats |
| `getUserVoteStatus()` | userId, matchId | UserVoteStatus | User's vote |
| `getUserVotingHistory()` | userId, pagination | PaginatedVotes | User history |
| `getUserVotesForMatches()` | userId, matchIds | Record<string, VoteOption> | Bulk lookup |

### Response Types

```typescript
VoteCounts: { team1: number, team2: number, draw: number, total: number }
VotePercentages: { team1: number, team2: number, draw: number }
MatchVoteStats: { matchId, counts, percentages, userVote? }
UserVoteStatus: { hasVoted: boolean, vote?: string, votedAt?: Date }
```

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/matches/:matchId/vote` | authenticate | Cast vote |
| DELETE | `/api/v1/matches/:matchId/vote` | authenticate | Remove vote |
| GET | `/api/v1/matches/:matchId/vote/status` | authenticate | User's status |
| GET | `/api/v1/matches/:matchId/votes` | optionalAuth | Vote statistics |
| GET | `/api/v1/votes/history` | authenticate | Voting history |

### Notable Features

- One vote per user per match
- Vote update (change choice) supported
- Prevents voting on completed matches
- Combined stats with optional user context

---

## 16. Support Module

**Location**: `src/modules/support/`

**Purpose**: Customer support ticket system.

### Model Schema (ITicket)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ticketNumber | String | Auto | Unique ID (TKT-YYMM-NNNNN) |
| user | ObjectId | Yes | User reporting |
| subject | String | Yes | Ticket title |
| description | String | Yes | Issue description |
| category | String | Yes | bug, feature, question, complaint, other |
| status | String | Yes | open, in_progress, waiting_reply, resolved, closed |
| priority | String | Yes | low, medium, high, urgent |
| replies | Array | No | [{user, message, isStaff, createdAt}] |
| assignedTo | ObjectId | No | Support staff |
| resolvedAt | Date | No | Resolution timestamp |
| closedAt | Date | No | Close timestamp |
| isDeleted | Boolean | Yes | Soft delete flag |
| createdAt | Date | Auto | Creation timestamp |

**Pre-save Logic:**
- Auto-generate ticketNumber with date + sequence (TKT-YYMM-NNNNN)

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `createTicket()` | userId, ticketData | Ticket | Create ticket |
| `getTickets()` | userId?, filters, pagination | PaginatedTickets | List tickets |
| `getTicketById()` | ticketId, userId? | Ticket | Get ticket |
| `updateTicket()` | ticketId, updateData | Ticket | Update ticket |
| `addReply()` | ticketId, userId, message, isStaff | Ticket | Add reply |
| `resolveTicket()` | ticketId | Ticket | Mark resolved |
| `closeTicket()` | ticketId | Ticket | Archive ticket |
| `assignTicket()` | ticketId, staffId | Ticket | Assign to staff |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/support/tickets` | authenticate | List tickets |
| GET | `/api/v1/support/tickets/:id` | authenticate | Get ticket |
| POST | `/api/v1/support/tickets` | authenticate | Create ticket |
| PUT | `/api/v1/support/tickets/:id` | requireSupportOrAdmin | Update ticket |
| POST | `/api/v1/support/tickets/:id/reply` | authenticate | Add reply |
| PATCH | `/api/v1/support/tickets/:id/resolve` | requireSupportOrAdmin | Resolve |
| PATCH | `/api/v1/support/tickets/:id/close` | requireSupportOrAdmin | Close |
| PATCH | `/api/v1/support/tickets/:id/assign` | requireSupportOrAdmin | Assign |

### Email Notifications

- `sendTicketCreatedEmail()` - Sent when ticket created
- `sendTicketReplyEmail()` - Sent when reply added

---


## 17. Standings Module

**Location**: `src/modules/standings/`

**Purpose**: Tournament standings and leaderboards.

### Model Schema (IStanding)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tournament | ObjectId | Yes | Tournament reference |
| team | ObjectId | Yes | Team reference |
| group | String | No | Group name (for group stages) |
| position | Number | Yes | Standing position |
| played | Number | Yes | Matches played |
| wins | Number | Yes | Win count |
| losses | Number | Yes | Loss count |
| draws | Number | No | Draw count |
| points | Number | Yes | Total points |
| mapWins | Number | No | Map wins |
| mapLosses | Number | No | Map losses |
| mapDifference | Number | Auto | Calculated map difference |
| isEliminated | Boolean | Yes | Elimination status |
| isQualified | Boolean | Yes | Qualification status |
| isActive | Boolean | Yes | Enable/disable |
| isDeleted | Boolean | Yes | Soft delete flag |

**Unique Constraint:** (tournament, team, group)

### Service Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `create()` | standingData | Standing | Create standing |
| `findByTournament()` | tournamentId, group? | Standing[] | Tournament standings |
| `findByTeam()` | teamId | Standing[] | Team's standings |
| `update()` | standingId, data | Standing | Update standing |
| `updateBulk()` | tournamentId, standings[] | Standing[] | Bulk update |
| `delete()` | standingId | void | Soft delete |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/standings/tournament/:tournamentId` | None | Tournament standings |
| GET | `/api/v1/standings/team/:teamId` | None | Team's standings |
| GET | `/api/v1/standings/:id` | None | Get standing |
| POST | `/api/v1/standings` | requireContentOrAdmin | Create standing |
| PUT | `/api/v1/standings/:id` | requireContentOrAdmin | Update standing |
| PUT | `/api/v1/standings/tournament/:tournamentId/bulk` | requireContentOrAdmin | Bulk update |
| DELETE | `/api/v1/standings/:id` | requireAdmin | Delete standing |

### Relationships

- `tournament` → Tournament (required)
- `team` → Team (required)

---

## 18. Settings Module

**Location**: `src/modules/settings/`

**Purpose**: Platform settings including languages, themes, about content, and privacy policy.

### Sub-models

**Language (ILanguage):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | String | Yes | Language code (en, ar, etc.) |
| name | String | Yes | Language name |
| nativeName | String | No | Native language name |
| isActive | Boolean | Yes | Enable/disable |
| isDefault | Boolean | Yes | Default language |
| dictionary | Map | No | Key-value translations |

**Theme (ITheme):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Theme name |
| slug | String | Yes | URL-friendly identifier |
| colors | Object | No | Color definitions |
| isActive | Boolean | Yes | Enable/disable |
| isDefault | Boolean | Yes | Default theme |

**AboutApp (IAboutApp):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | About title |
| content | String | Yes | About content |
| version | String | No | App version |
| lastUpdated | Date | Auto | Last update |

**PrivacyPolicy (IPrivacyPolicy):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Policy title |
| content | String | Yes | Policy content |
| effectiveDate | Date | No | Effective date |
| lastUpdated | Date | Auto | Last update |

### API Endpoints

**Languages:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/settings/languages` | None | List languages |
| GET | `/api/v1/settings/languages/:code` | None | Get language |
| POST | `/api/v1/settings/languages` | requireSupportOrAdmin | Create language |
| PUT | `/api/v1/settings/languages/:code` | requireSupportOrAdmin | Update language |
| DELETE | `/api/v1/settings/languages/:code` | requireAdmin | Delete language |

**Themes:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/settings/themes` | None | List themes |
| GET | `/api/v1/settings/themes/:slug` | None | Get theme |
| POST | `/api/v1/settings/themes` | requireSupportOrAdmin | Create theme |
| PUT | `/api/v1/settings/themes/:slug` | requireSupportOrAdmin | Update theme |
| DELETE | `/api/v1/settings/themes/:slug` | requireAdmin | Delete theme |

**About/Privacy:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/settings/about` | None | Get about content |
| PUT | `/api/v1/settings/about` | requireSupportOrAdmin | Update about |
| GET | `/api/v1/settings/privacy` | None | Get privacy policy |
| PUT | `/api/v1/settings/privacy` | requireSupportOrAdmin | Update privacy |

---

## Common Types Reference

### ImageObject

```typescript
{
  light?: string,  // URL for light mode
  dark?: string    // URL for dark mode
}
```

### CountryObject

```typescript
{
  name?: string,   // Country name
  code?: string,   // ISO 3166-1 alpha-2 code
  flag?: string    // Emoji flag
}
```

### Pagination Response

```typescript
{
  data: T[],
  meta: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
  }
}
```

### Standard Response

```typescript
// Success
{ success: true, data: T }

// Success with message
{ success: true, message: string }

// Error
{ success: false, message: string, errors?: ValidationError[] }
```

---

## 19. Translations Module

**Location**: `src/modules/translations/`

**Purpose**: Database-driven translation overrides for i18n system.

### Model Schema (ITranslation)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| languageCode | String | Yes | Language code (en, ar) |
| key | String | Yes | Translation key |
| value | String | Yes | Translated text |
| namespace | String | No | Optional namespace |
| createdBy | ObjectId | No | User who created |
| updatedBy | ObjectId | No | User who updated |
| isDeleted | Boolean | Yes | Soft delete flag |

**Unique Constraint:** (languageCode, key)

### API Endpoints

**Public:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/translations/:lang` | None | Get translations for language |
| GET | `/api/v1/languages` | None | Get available languages |

**Admin:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/admin/translations` | requireAdmin | List all translations |
| POST | `/api/v1/admin/translations` | requireAdmin | Create translation |
| PUT | `/api/v1/admin/translations/:id` | requireAdmin | Update translation |
| DELETE | `/api/v1/admin/translations/:id` | requireAdmin | Delete translation |

---

## 20. Avatars Module

**Location**: `src/modules/avatars/`

**Purpose**: Pre-made user profile avatars for selection.

### Model Schema (IAvatar)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Avatar name |
| imageUrl | String | Yes | Avatar image URL |
| category | String | No | Avatar category |
| isActive | Boolean | Yes | Enable/disable |
| sortOrder | Number | No | Display ordering |
| isDeleted | Boolean | Yes | Soft delete flag |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/avatars` | None | List all avatars |
| GET | `/api/v1/avatars/:id` | None | Get avatar |
| POST | `/api/v1/avatars` | requirePermission('Avatar', 'create') | Create avatar |
| PUT | `/api/v1/avatars/:id` | requirePermission('Avatar', 'update') | Update avatar |
| DELETE | `/api/v1/avatars/:id` | requirePermission('Avatar', 'delete') | Delete avatar |

---

## 21. Notifications Module

**Location**: `src/modules/notifications/`

**Purpose**: Push notifications via Firebase Cloud Messaging (FCM), device management, user preferences, and notification history.

### Model Schemas

**UserDevice (IUserDevice):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user | ObjectId | Yes | User reference |
| fcmToken | String | Yes | Firebase Cloud Messaging token |
| deviceType | String | Yes | 'ios' \| 'android' \| 'web' |
| deviceId | String | No | Unique device identifier |
| deviceName | String | No | Device name/model |
| appVersion | String | No | App version |
| osVersion | String | No | OS version |
| isActive | Boolean | Yes | Device active status |
| lastActiveAt | Date | Auto | Last activity timestamp |

**NotificationPreferences (INotificationPreferences):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user | ObjectId | Yes | User reference (unique) |
| pushEnabled | Boolean | Yes | Master push toggle |
| matchNotifications | Object | Yes | Match notification settings |
| newsNotifications | Object | Yes | News notification settings |
| transferNotifications | Object | Yes | Transfer notification settings |
| tournamentNotifications | Object | Yes | Tournament notification settings |

**Match Notification Settings:**
- `enabled` - Master toggle for match notifications
- `matchStart` - Notify when followed matches start
- `matchEnd` - Notify when followed matches end
- `scoreUpdate` - Notify on score changes
- `upcomingReminder` - Notify before match starts
- `reminderMinutes` - Minutes before match for reminder

**News Notification Settings:**
- `enabled` - Master toggle
- `breakingNews` - Breaking news alerts
- `followedEntities` - News about followed items

**Transfer Notification Settings:**
- `enabled` - Master toggle
- `confirmed` - Confirmed transfers
- `rumors` - Transfer rumors

**Tournament Notification Settings:**
- `enabled` - Master toggle
- `newTournament` - New tournament announcements
- `phaseChanges` - Phase/stage changes

**NotificationLog (INotificationLog):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user | ObjectId | Yes | User reference |
| type | String | Yes | Notification type |
| title | String | Yes | Notification title |
| body | String | Yes | Notification body |
| imageUrl | String | No | Optional image |
| data | Object | No | Custom payload data |
| entityType | String | No | Related entity type |
| entityId | ObjectId | No | Related entity ID |
| status | String | Yes | 'pending' \| 'sent' \| 'failed' \| 'clicked' |
| errorMessage | String | No | Error details if failed |
| sentAt | Date | No | When notification sent |
| clickedAt | Date | No | When user clicked |

**TTL Index:** Notifications auto-delete after 30 days.

### Notification Types

- `match_start` - Match starting notification
- `match_end` - Match ended notification
- `match_reminder` - Upcoming match reminder
- `news` - News article notification
- `transfer` - Transfer news notification
- `tournament` - Tournament update notification
- `announcement` - General announcement
- `topic` - Topic-based notification

### Service Methods

**Device Management:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `registerDevice()` | userId, deviceData | Device | Register user device |
| `updateDevice()` | userId, deviceId, data | Device | Update device info |
| `removeDevice()` | userId, deviceId | void | Remove device |
| `getUserDevices()` | userId | Device[] | Get user's devices |

**Preferences:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getPreferences()` | userId | Preferences | Get user preferences |
| `updatePreferences()` | userId, data | Preferences | Update preferences |

**Notification History:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getNotificationHistory()` | userId, filters, pagination | PaginatedLogs | Get notification history |
| `markAsClicked()` | userId, notificationId | Log | Mark as read/clicked |
| `deleteNotification()` | userId, notificationId | void | Delete notification |

**Sending Notifications:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `sendToUser()` | userId, notification | SendResult | Send to specific user |
| `sendToTopic()` | topic, notification | SendResult | Send to topic subscribers |
| `adminSendNotification()` | targetData, notification | SendResult | Admin bulk send |

**Topic Management:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `subscribeToTopic()` | userId, topic | void | Subscribe user to topic |
| `unsubscribeFromTopic()` | userId, topic | void | Unsubscribe from topic |

### API Endpoints

**User Routes - Devices:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/notifications/devices` | authenticate | Register device |
| GET | `/api/v1/notifications/devices` | authenticate | Get user's devices |
| PUT | `/api/v1/notifications/devices/:id` | authenticate | Update device |
| DELETE | `/api/v1/notifications/devices/:id` | authenticate | Remove device |

**User Routes - Preferences:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/notifications/preferences` | authenticate | Get preferences |
| PUT | `/api/v1/notifications/preferences` | authenticate | Update preferences |
| PATCH | `/api/v1/notifications/preferences` | authenticate | Partial update |

**User Routes - Notification History:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/notifications` | authenticate | Get notification history |
| POST | `/api/v1/notifications/:id/read` | authenticate | Mark as read |
| DELETE | `/api/v1/notifications/:id` | authenticate | Delete notification |

**Admin Routes:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/admin/notifications/send` | requireAdmin | Send notification |
| GET | `/api/v1/admin/notifications/stats` | requireAdmin | Get statistics |

### Admin Send Notification Target Types

```typescript
{
  target: {
    type: 'topic' | 'all' | 'users' | 'segment',
    topic?: string,      // For type='topic'
    userIds?: string[],  // For type='users'
    segment?: {          // For type='segment'
      games?: string[],
      teams?: string[]
    }
  },
  notification: {
    title: string,
    body: string,
    imageUrl?: string,
    data?: Record<string, string>
  }
}
```

### Topic Naming Convention

Topics are auto-managed based on follows:
- `game_{gameId}` - Game followers
- `team_{teamId}` - Team followers
- `player_{playerId}` - Player followers
- `tournament_{tournamentId}` - Tournament followers

### Relationships

- `UserDevice.user` → User
- `NotificationPreferences.user` → User (unique)
- `NotificationLog.user` → User
- `NotificationLog.entityId` → Game/Team/Player/Tournament/Match/News (polymorphic)

### Notable Features

- Graceful degradation when Firebase not configured
- Batch sending for multiple users
- Topic-based subscriptions linked to follows
- 30-day TTL for notification history
- Click tracking for engagement metrics
