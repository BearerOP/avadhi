# Website Logs API Implementation

## ✅ **Goal Achieved: 5-minute aggregated logs per website**

---

## 📌 **1. API Route**

```http
GET /api/v1/website/:websiteId/logs?after=timestamp
```

### **Description:**
Fetch 5-minute interval logs for a specific website **after a given timestamp**.

### **Parameters:**
- `websiteId` (path): The ID of the website
- `after` (query, optional): ISO timestamp to fetch logs after (defaults to 1 hour ago)

### **Authentication:**
Requires Bearer token in Authorization header

---

## 📌 **2. Backend Implementation**

### **Location:** `apps/api/routes/v1/websites.ts`

```typescript
websitesRouter.get("/:websiteId/logs", auth, async (req, res) => {
  try {
    const userId = req.userId as string;
    const { websiteId } = req.params;
    const after = req.query.after || new Date(Date.now() - 60 * 60 * 1000); // default: last 1 hour

    // First verify the website belongs to the user
    const website = await prismaClient.website.findUnique({
      where: { 
        id: websiteId,
        user_id: userId // Ensure user can only view their own websites
      },
    });

    if (!website) {
      res.status(404).json({ message: "Website not found" });
      return;
    }

    // Fetch 5-minute aggregated logs using raw SQL for efficiency
    const logs = await prismaClient.$queryRawUnsafe(`
      SELECT 
        date_trunc('minute', "createdAt") - (EXTRACT(minute from "createdAt")::int % 5) * interval '1 minute' AS interval_start,
        AVG("response_time_ms") AS avg_response_time_ms,
        COUNT(*) AS ping_count,
        BOOL_OR("status" = 'UP') AS is_up
      FROM "WebsiteTick"
      WHERE "website_id" = $1 AND "createdAt" > $2
      GROUP BY interval_start
      ORDER BY interval_start DESC
      LIMIT 12;
    `, websiteId, after);

    res.status(200).json({
      message: "Website logs fetched successfully",
      data: logs,
    });
  } catch (error) {
    console.error("Get website logs error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
```

---

## 📌 **3. Database Schema Updates**

### **Location:** `packages/store/prisma/schema.prisma`

Added index for optimal performance:

```prisma
model WebsiteTick {
  // ... existing fields ...

  @@index([website_id, region_id])
  @@index([website_id, createdAt]) // ← NEW: Optimized for logs queries
}
```

### **Migration:**
```bash
cd packages/store
npx prisma migrate dev --name add_website_tick_logs_index
```

---

## 📌 **4. Sample Response**

```json
{
  "message": "Website logs fetched successfully",
  "data": [
    {
      "interval_start": "2025-01-27T12:05:00.000Z",
      "avg_response_time_ms": 240,
      "ping_count": 3,
      "is_up": true
    },
    {
      "interval_start": "2025-01-27T12:00:00.000Z",
      "avg_response_time_ms": 180,
      "ping_count": 5,
      "is_up": true
    },
    {
      "interval_start": "2025-01-27T11:55:00.000Z",
      "avg_response_time_ms": 320,
      "ping_count": 2,
      "is_up": false
    }
  ]
}
```

---

## 📌 **5. Frontend Integration**

### **React Component:** `apps/web/components/WebsiteLogs.tsx`

```typescript
// Fetch logs for the last 5 minutes (for real-time updates)
const fetchRecentLogs = async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  await fetchLogs(fiveMinutesAgo);
};

// Auto-refresh every 5 minutes
useEffect(() => {
  const interval = setInterval(fetchRecentLogs, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, [websiteId]);
```

### **Usage Example:**
```typescript
import WebsiteLogs from './components/WebsiteLogs';

function Dashboard() {
  return (
    <WebsiteLogs 
      websiteId="your-website-id" 
      authToken="your-jwt-token" 
    />
  );
}
```

---

## 📌 **6. Testing**

### **Test File:** `apps/api/test-logs-endpoint.js`

```javascript
// Example 1: Fetch logs for the last hour (default)
fetchLogsLastHour(websiteId, authToken);

// Example 2: Fetch logs after a specific timestamp
const customTimestamp = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
fetchLogsAfterTimestamp(websiteId, authToken, customTimestamp);

// Example 3: Fetch logs for the last 5 minutes (for real-time updates)
fetchLogsLast5Minutes(websiteId, authToken);
```

---

## 📌 **7. Optimization Features**

| Feature | Implementation | Benefit |
|---------|---------------|---------|
| **Fetch Delta Only** | `after` query parameter | Reduces data transfer |
| **Reduce DB Load** | 5-minute bucketing in SQL | Efficient aggregation |
| **Indexing** | `@@index([website_id, createdAt])` | Fast queries |
| **User Security** | Verify website ownership | Data isolation |
| **Raw SQL** | `$queryRawUnsafe` | PostgreSQL-specific optimizations |

---

## 📌 **8. SQL Query Breakdown**

```sql
SELECT 
  -- Create 5-minute buckets
  date_trunc('minute', "createdAt") - (EXTRACT(minute from "createdAt")::int % 5) * interval '1 minute' AS interval_start,
  
  -- Calculate average response time per bucket
  AVG("response_time_ms") AS avg_response_time_ms,
  
  -- Count pings per bucket
  COUNT(*) AS ping_count,
  
  -- Check if any ping in bucket was UP
  BOOL_OR("status" = 'UP') AS is_up
  
FROM "WebsiteTick"
WHERE "website_id" = $1 AND "createdAt" > $2
GROUP BY interval_start
ORDER BY interval_start DESC
LIMIT 12;
```

**Explanation:**
- `date_trunc('minute', ...)` - Truncate to minute precision
- `EXTRACT(minute from ...)::int % 5` - Get minute within hour, then modulo 5
- `* interval '1 minute'` - Convert back to time interval
- `BOOL_OR("status" = 'UP')` - Returns true if ANY ping in bucket was UP

---

## 📌 **9. Error Handling**

| Error Case | HTTP Status | Response |
|------------|-------------|----------|
| Website not found | 404 | `{ "message": "Website not found" }` |
| Unauthorized | 401 | `{ "message": "Unauthorized" }` |
| Server error | 500 | `{ "message": "Internal server error" }` |

---

## 📌 **10. Performance Considerations**

### **Database:**
- Index on `(website_id, createdAt)` for fast range queries
- 5-minute bucketing reduces result set size
- LIMIT 12 prevents excessive data transfer

### **Application:**
- User ownership verification prevents data leaks
- Default 1-hour window balances data vs performance
- Raw SQL leverages PostgreSQL's time functions

### **Frontend:**
- Auto-refresh every 5 minutes for real-time updates
- Delta fetching with `after` parameter
- Loading states and error handling

---

## 🚀 **Ready to Use!**

The implementation is complete and ready for production use. The API efficiently fetches 5-minute aggregated logs with proper security, performance optimizations, and comprehensive error handling. 