# Player Management Redesign Plan

## Overview
Redesign the player management pages to match the modern News management UI pattern.

## Components to Create

### 1. PlayerFormRedesign.jsx
New form component with:
- **Header Section:**
  - Back button (ArrowLeft icon)
  - Title (Add Player / Edit Player)
  - Subtitle (player name when editing)
  - Validation error count badge

- **Required Fields Notice:**
  - Blue alert box with AlertCircle icon

- **Form Sections:**
  1. **Basic Information (Required)**
     - Icon: User
     - Fields: First Name, Last Name, Nickname

  2. **Personal Details (Required)**
     - Icon: Calendar
     - Fields: Birth Date, Country

  3. **Profile Photos (Required)**
     - Icon: Image
     - Fields: Light Mode Photo, Dark Mode Photo

  4. **Team & Game (Required)**
     - Icon: Users
     - Fields: Team Select, Main Game Select

  5. **Related Entities (Optional)**
     - Icon: Link
     - Fields: Related News, Tournaments

- **Sticky Submit Area:**
  - Gradient background
  - Required fields legend
  - Cancel + Submit buttons with icons

### 2. PlayerListRedesign.jsx
New list component with:
- **Header:**
  - Title: "Players Management"
  - Subtitle: "Manage all players"
  - Refresh button (animated spinner on loading)
  - Add Player button (green)

- **Search Bar:**
  - Simple search input with Search icon

- **Player Cards Grid:**
  - Card-based layout
  - Empty state with emoji and CTA

- **Pagination:**
  - Only shows if totalPages > 1

### 3. PlayerCard.jsx
Individual player card with:
- **Left Side: Player Photo**
  - Image with fallback placeholder
  - Team badge overlay (bottom-left)

- **Right Side: Content**
  - Player nickname (main title)
  - Real name (first + last)
  - Game badge
  - Country flag/badge

- **Meta Info:**
  - Age with Calendar icon
  - Team name with Users icon
  - Country with Flag icon

- **Actions:**
  - Edit button (green outline)
  - Dropdown menu:
    - View Profile
    - Edit Awards
    - Edit Links
    - Edit Favorite Characters
    - Delete (red)

## Files to Modify

### New Files
- `components/Player Management/PlayerFormRedesign.jsx`
- `components/Player Management/PlayerListRedesign.jsx`
- `components/Player Management/PlayerCard.jsx`

### Updated Files
- `app/[locale]/dashboard/player-management/add/page.jsx`
- `app/[locale]/dashboard/player-management/edit/page.jsx`
- `app/[locale]/dashboard/player-management/edit/[id]/page.jsx`
- `messages/en.json` (translation keys)
- `messages/ar.json` (translation keys)

## Translation Keys to Add

```json
{
  "playerForm": {
    "addPlayer": "Add Player",
    "editPlayer": "Edit Player",
    "editingPlayer": "Editing: {name}",
    "basicInfo": "Basic Information",
    "personalDetails": "Personal Details",
    "profilePhotos": "Profile Photos",
    "teamAndGame": "Team & Game",
    "relatedEntities": "Related Entities",
    "required": "Required",
    "optional": "Optional",
    "requiredFields": "Required fields",
    "requiredFieldsNotice": "Fields marked with * are required",
    "validationErrors": "{count} validation errors",
    "cancel": "Cancel",
    "submit": "Add Player",
    "save": "Save Changes"
  },
  "playerList": {
    "title": "Players Management",
    "subtitle": "Manage all players in the system",
    "addPlayer": "Add Player",
    "searchPlaceholder": "Search players...",
    "noPlayers": "No Players Found",
    "noPlayersDescription": "Start by adding your first player",
    "addFirstPlayer": "Add First Player"
  },
  "playerCard": {
    "edit": "Edit",
    "viewProfile": "View Profile",
    "editAwards": "Edit Awards",
    "editLinks": "Edit Links",
    "editCharacters": "Edit Favorite Characters",
    "delete": "Delete",
    "yearsOld": "{age} years old",
    "noTeam": "No Team"
  }
}
```

## Design Tokens
- Background: `bg-dashboard-box dark:bg-[#0F1017]`
- Text Primary: `text-white`
- Text Secondary: `text-[#677185]`
- Primary Action: `bg-green-primary`
- Border: `border-green-primary`
- Hover: `hover:ring-1 hover:ring-green-primary/30`
- Required Badge: `bg-red-500/20 text-red-400`
- Optional Badge: `bg-gray-500/20 text-gray-400`

## Implementation Order
1. Create PlayerFormRedesign.jsx
2. Create PlayerCard.jsx
3. Create PlayerListRedesign.jsx
4. Add translation keys
5. Update page files
6. Test locally
7. Deploy

## Validation Schema
```javascript
const validationSchema = Yup.object({
  // Required
  firstName: Yup.string().required().max(50),
  lastName: Yup.string().required().max(50),
  nickname: Yup.string().required().max(50),
  birthDate: Yup.date().required(),
  country: Yup.string().required(),
  photoLight: Yup.string().required(),

  // Optional
  photoDark: Yup.string(),
  team: Yup.string(),
  game: Yup.string(),
  news: Yup.array(),
  tournaments: Yup.array()
});
```
