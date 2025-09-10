# Google Analytics Implementation Guide

This document explains how Google Analytics has been implemented in your Loan Calculator web application.

## 🚀 Quick Setup

### 1. Get Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Configure Environment Variable

Update your `.env.local` file with your actual Google Analytics Measurement ID:

```bash
# Replace G-XXXXXXXXXX with your actual measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

**Important**: The `NEXT_PUBLIC_` prefix is required for client-side access in Next.js.

### 3. Deploy and Test

Once you've added your measurement ID, your analytics will start tracking automatically.

## 📊 What's Being Tracked

### Automatic Tracking
- **Page Views**: All page navigation is automatically tracked
- **User Sessions**: Standard GA4 session tracking
- **Device/Browser Info**: Automatic demographic data

### Custom Events

#### Calculator Usage
- **Event**: `calculate`
- **Category**: `calculator_{type}` (mortgage, auto-loan, personal-loan, investment)
- **Tracked Data**:
  - Loan amount ranges (categorized for privacy)
  - Interest rate ranges
  - Loan term (in years)

#### Navigation
- **Event**: `navigate`
- **Category**: `navigation`
- **Label**: `{source}_to_{destination}`

#### Form Interactions
- **Event**: `complete`
- **Category**: `form_{calculator_type}`

#### PDF Exports
- **Event**: `export_pdf`
- **Category**: `calculator_{type}`
- **Label**: Report type (summary, schedule, chart)

## 🧪 Testing Your Implementation

### 1. Development Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser's Developer Tools (F12)

3. Go to the **Network** tab and filter by "google-analytics" or "gtag"

4. Navigate through your app and use the calculators

5. You should see network requests to Google Analytics

### 2. Real-time Testing

1. Go to your Google Analytics dashboard
2. Navigate to **Reports** > **Realtime**
3. Use your website in another tab
4. You should see real-time activity in the dashboard

### 3. Event Testing

Test these specific interactions:

- **Navigation**: Click between different calculator pages
- **Calculator Usage**: Enter values and see calculations update
- **PDF Export**: Download a PDF report (if available)
- **Form Submission**: Complete a calculator form

## 🔧 Technical Implementation

### Files Modified/Created

1. **`.env.local`** - Added GA measurement ID
2. **`src/app/layout.tsx`** - Added GoogleAnalytics component
3. **`src/lib/analytics.ts`** - Custom tracking utilities
4. **`src/hooks/usePageTracking.ts`** - Page view tracking hook
5. **`src/components/PageTracker.tsx`** - Page tracking component
6. **Calculator components** - Added event tracking

### Architecture

```
┌─────────────────┐
│   layout.tsx    │ ← GoogleAnalytics component
│                 │ ← PageTracker component
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  analytics.ts   │ ← Custom tracking functions
│                 │ ← Event categorization
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Components     │ ← Calculator tracking
│                 │ ← Navigation tracking
│                 │ ← Form tracking
└─────────────────┘
```

## 🔒 Privacy Considerations

### Data Collection
- **Anonymized**: No personally identifiable information is collected
- **Categorized**: Loan amounts and rates are grouped into ranges
- **Compliant**: Follows GDPR and privacy best practices

### What's NOT Tracked
- Exact loan amounts (only ranges)
- Personal information
- Sensitive financial details
- User identification data

## 🚨 Troubleshooting

### Common Issues

1. **No data in GA dashboard**
   - Check that `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
   - Verify the measurement ID format (`G-XXXXXXXXXX`)
   - Wait 24-48 hours for data to appear in reports

2. **Events not showing**
   - Check browser console for JavaScript errors
   - Verify network requests in Developer Tools
   - Test in incognito mode to avoid ad blockers

3. **Development vs Production**
   - GA works in both development and production
   - Use different measurement IDs for dev/prod if needed

### Debug Mode

Add this to your browser console to enable GA debug mode:
```javascript
window.gtag('config', 'YOUR_MEASUREMENT_ID', {
  debug_mode: true
});
```

## 📈 Analytics Dashboard Setup

### Recommended Custom Reports

1. **Calculator Usage Report**
   - Dimension: Event Name
   - Metric: Event Count
   - Filter: Event Category contains "calculator"

2. **User Flow Report**
   - Track navigation patterns between calculators
   - Identify most popular calculation types

3. **Conversion Funnel**
   - Page View → Calculator Use → PDF Export
   - Measure user engagement depth

## 🔄 Maintenance

### Regular Tasks
- Monitor GA dashboard for data accuracy
- Review custom events for business insights
- Update tracking as new features are added
- Check for GA4 updates and best practices

### Performance Impact
- Minimal: GA loads asynchronously
- No blocking of main application functionality
- Respects user privacy settings and ad blockers
