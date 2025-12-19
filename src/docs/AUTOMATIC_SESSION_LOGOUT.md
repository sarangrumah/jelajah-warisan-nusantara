# Automatic Session Logout Feature

## Overview

The admin panel now includes an automatic session logout feature that logs out users after 5 minutes of inactivity. This enhances security by preventing unauthorized access when administrators leave their workstations unattended.

## Features

### 🎯 Core Functionality
- **Automatic Logout**: Users are automatically logged out after 5 minutes of inactivity
- **Warning System**: Users receive a warning notification 1 minute before logout
- **Activity Detection**: The system tracks various types of user activity
- **Visual Indicator**: Session timeout countdown is displayed in the top-right corner

### 🔧 Customization Options
- **Configurable Timeouts**: Adjust timeout and warning durations
- **Activity Types**: Monitor mouse, keyboard, scroll, touch, and click events
- **Throttled Detection**: Optimized performance with throttled event listeners

## How It Works

### 1. Activity Detection
The system monitors these user activities:
- Mouse movements and clicks
- Keyboard input (key presses)
- Scrolling
- Touch events (mobile devices)
- Tab visibility changes

### 2. Timer Management
- **Reset on Activity**: Any user activity resets the 5-minute timer
- **Warning Phase**: At 4 minutes of inactivity, a warning notification appears
- **Auto Logout**: At 5 minutes, the user is automatically logged out

### 3. User Experience
- **Toast Notifications**: Non-intrusive warnings and logout notifications
- **Visual Indicator**: Session timer display in top-right corner
- **Seamless Logout**: Automatic redirect to login page after timeout

## Configuration

### Basic Usage (Default Settings)
```tsx
// In AdminDashboard.tsx - uses default 5-minute timeout
useIdleTimeout();
```

### Custom Configuration
```tsx
useIdleTimeout({
  timeoutMinutes: 10,    // 10 minutes before logout
  warningMinutes: 2,     // Warn 2 minutes before logout
  onTimeout: () => {
    console.log('Session expired');
    // Custom cleanup logic
  },
  onWarning: () => {
    console.log('Session warning shown');
    // Custom warning logic
  }
});
```

### Available Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeoutMinutes` | number | 5 | Minutes of inactivity before logout |
| `warningMinutes` | number | 1 | Minutes before timeout to show warning |
| `onTimeout` | function | - | Callback when session expires |
| `onWarning` | function | - | Callback when warning is shown |

## Implementation Details

### Files Created/Modified

1. **`src/hooks/useIdleTimeout.ts`**
   - Main hook for managing idle timeout logic
   - Handles activity detection and timer management
   - Provides configurable options and callbacks

2. **`src/components/SessionTimeoutIndicator.tsx`**
   - Visual component showing session status
   - Displays countdown timer during warning phase
   - Uses badge component for consistent UI

3. **`src/pages/AdminDashboard.tsx`**
   - Integrated idle timeout hook
   - Added session timeout indicator component

### Activity Detection Events
The system listens for these events (throttled for performance):
- `mousedown`
- `mousemove`
- `keypress`
- `scroll`
- `touchstart`
- `click`
- `visibilitychange` (tab switching)

## Security Benefits

### 🚀 Enhanced Security
- **Prevents Unauthorized Access**: Automatic logout prevents others from accessing admin functions
- **Reduces Risk**: Minimizes exposure time if workstation is unattended
- **Compliance**: Helps meet security requirements for admin panels

### 🔒 Session Management
- **JWT Token Cleanup**: Automatically clears stored authentication tokens
- **State Management**: Resets React authentication state
- **Navigation**: Redirects to login page after timeout

## Testing the Feature

### Manual Testing Steps
1. **Login to Admin Panel**
   - Navigate to `/admin`
   - Login with valid credentials

2. **Test Normal Operation**
   - Verify session indicator shows active status
   - Perform various activities (click, scroll, type)
   - Confirm timer resets with each activity

3. **Test Warning System**
   - Wait 4 minutes without activity
   - Verify warning toast appears
   - Check session indicator turns red

4. **Test Auto Logout**
   - Wait 5 minutes total without activity
   - Verify automatic logout occurs
   - Confirm redirect to login page

5. **Test Activity Reset**
   - Wait for warning phase
   - Perform any activity
   - Verify timer resets and warning clears

## Browser Compatibility

### Supported Events
- **Desktop**: All mouse, keyboard, and scroll events
- **Mobile**: Touch events and viewport changes
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)

### Performance Considerations
- **Throttled Events**: Event listeners are throttled to prevent performance issues
- **Memory Management**: Timers are properly cleaned up on component unmount
- **Efficient Tracking**: Activity detection optimized for minimal resource usage

## Troubleshooting

### Common Issues

1. **Session Not Timing Out**
   - Check if activity events are being triggered
   - Verify useIdleTimeout is properly imported and called
   - Ensure no conflicting event listeners

2. **Warning Not Showing**
   - Confirm warningMinutes < timeoutMinutes
   - Check console for any JavaScript errors
   - Verify toast notifications are working

3. **Auto Logout Not Working**
   - Check if signOut function is properly connected
   - Verify authentication state management
   - Ensure JWT token cleanup is functioning

### Debug Mode
Add console logging to troubleshoot:
```tsx
useIdleTimeout({
  timeoutMinutes: 5,
  onTimeout: () => console.log('DEBUG: Session timeout'),
  onWarning: () => console.log('DEBUG: Session warning')
});
```

## Future Enhancements

### Potential Improvements
- **Configurable Per User Role**: Different timeouts for different admin roles
- **Activity Heat Map**: Track most active periods for analytics
- **Session Extension**: Allow users to extend session before timeout
- **Integration with Backend**: Server-side session validation
- **Custom Warning Messages**: Localized or role-specific warnings

### API Integration
Future versions could include:
- Server-side session tracking
- Cross-tab synchronization
- Real-time session monitoring
- Admin override capabilities

## Security Best Practices

### Implementation Guidelines
1. **Minimum Timeout**: Never set timeout below 5 minutes for admin panels
2. **Activity Detection**: Monitor all relevant user interaction types
3. **Clean State**: Ensure complete cleanup on timeout
4. **User Notification**: Always warn users before auto logout
5. **Testing**: Regularly test timeout functionality

### Additional Recommendations
- Consider implementing IP-based restrictions
- Add session monitoring for concurrent logins
- Implement audit logging for security events
- Regular security reviews of timeout implementation

---

**Note**: This feature is specifically designed for the admin panel and does not affect regular user sessions on the public website.