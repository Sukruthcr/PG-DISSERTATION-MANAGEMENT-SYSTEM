# Complete System Reset

## ✅ Database Status

**Current State:** Database is CLEAN - 0 projects

But admin panel still shows old projects because of:
1. Browser cache
2. Old static files in `dist/` folder
3. Server serving cached data

## 🚀 Complete Reset Procedure

### Step 1: Stop All Running Processes

Press **Ctrl+C** in all terminals to stop:
- Server (node server.js)
- Dev server (npm run dev)

### Step 2: Clear Browser Cache

**Option A: Hard Refresh**
- Press **Ctrl+Shift+Delete**
- Select "Cached images and files"
- Click "Clear data"

**Option B: Incognito Mode**
- Press **Ctrl+Shift+N**
- Open `http://localhost:3001`

### Step 3: Delete Old Build Files

```powershell
# In PowerShell
Remove-Item -Recurse -Force dist
```

Or manually delete the `dist` folder.

### Step 4: Rebuild Frontend

```bash
npm run build
```

### Step 5: Restart Server

```bash
node server.js
```

### Step 6: Open Fresh Browser

1. Open **new incognito window** (Ctrl+Shift+N)
2. Go to `http://localhost:3001`
3. Login as admin
4. Check "User Topics" - should show **0 projects**

## 🎯 Expected Result

**Admin Panel → User Topics:**
```
No projects found
```

**Database:**
```
Projects: 0
Guide Assignments: 0
Coordinator Assignments: 0
```

## ✅ Verification Commands

### Check Database
```bash
node check-database.js
```

Should show:
```
Students: 1
Projects: 0  ← Should be 0!
Guides: 1
```

### Check API Directly
```bash
curl http://localhost:3001/api/student-projects
```

Should return:
```json
{"success":true,"projects":[]}
```

## 🔧 If Still Showing Old Projects

### Option 1: Clear Browser Storage

1. Press **F12** (Developer Tools)
2. Go to **Application** tab
3. Click **Clear storage**
4. Click **Clear site data**
5. Refresh page

### Option 2: Use Different Browser

Try Chrome/Edge/Firefox to see if it's browser-specific.

### Option 3: Check Server Logs

When you load the admin panel, server should log:
```
GET /api/student-projects
```

Check what it returns in the response.

## 📝 After Reset - Fresh Start

Once admin panel shows 0 projects:

1. **Students submit NEW projects**
   - Login as student
   - Submit project with proper details
   - Project saved to database

2. **Admin assigns guides**
   - See the new project
   - Assign guide
   - Should work perfectly

3. **Guide reviews project**
   - See assigned student
   - Review and assign marks

## 🎉 Success Indicators

✅ Admin panel shows "No projects found"  
✅ Database has 0 projects  
✅ API returns empty array  
✅ Browser cache cleared  
✅ Fresh build completed  
✅ Server restarted  

---

**Status:** Database clean, need to clear browser cache  
**Action:** Follow steps above  
**Result:** Admin panel will show 0 projects
