# Image Fix Deployment Checklist

## Pre-Deployment

### Local Testing
- [ ] Run `npm install` to ensure dependencies are up to date
- [ ] Run `npm run build` successfully
- [ ] Run `npm run preview` and test locally at http://localhost:4173
- [ ] Verify images load in preview mode
- [ ] Check browser console for errors
- [ ] Test on different browsers (Chrome, Firefox, Safari)

### Code Review
- [ ] Review changes in `src/lib/asset-url.ts`
- [ ] Review changes in `src/components/HeroSection.tsx`
- [ ] Review changes in `backend/src/server.ts`
- [ ] Review changes in `public/_headers`
- [ ] Review changes in `vite.config.ts`
- [ ] Verify no TypeScript errors: `npx tsc --noEmit`

### Backup
- [ ] Backup current production code
- [ ] Backup database (if making path changes)
- [ ] Document current PM2 configuration
- [ ] Note current server status

## Deployment Steps

### 1. Build Phase
- [ ] Navigate to project directory
- [ ] Run `npm install`
- [ ] Run `npm run build`
- [ ] Verify `dist` directory created
- [ ] Check build output for errors

### 2. Copy Phase
- [ ] Create `backend/public` directory if needed
- [ ] Copy `dist/*` to `backend/public/`
- [ ] Verify files copied successfully
- [ ] Check file permissions

### 3. Backend Phase
- [ ] Navigate to `backend` directory
- [ ] Run `npm install`
- [ ] Verify no installation errors
- [ ] Check backend configuration

### 4. Restart Phase
- [ ] Stop current servers gracefully
- [ ] Restart backend: `pm2 restart backend-app`
- [ ] Restart frontend: `pm2 restart frontend-app` (if separate)
- [ ] Verify servers started successfully
- [ ] Check PM2 status: `pm2 list`

## Post-Deployment Testing

### Immediate Checks (First 5 Minutes)
- [ ] Visit https://museumcagarbudaya.kemenbud.go.id
- [ ] Homepage loads successfully
- [ ] Hero section images display
- [ ] No JavaScript errors in console
- [ ] No 404 errors in Network tab
- [ ] No CORS errors in console

### Detailed Testing (First 30 Minutes)
- [ ] Test all hero/banner images
- [ ] Navigate to Museums page - check images
- [ ] Navigate to Collections page - check images
- [ ] Navigate to News page - check images
- [ ] Navigate to Events page - check images
- [ ] Test image loading on mobile view
- [ ] Test image loading on tablet view
- [ ] Test image loading on desktop view

### Performance Checks
- [ ] Images load within acceptable time
- [ ] No excessive network requests
- [ ] Caching headers working correctly
- [ ] No memory leaks in browser
- [ ] Server CPU/memory usage normal

### Browser Compatibility
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] Test on mobile browsers

## Monitoring (First 24 Hours)

### Server Monitoring
- [ ] Check PM2 logs regularly: `pm2 logs`
- [ ] Monitor server CPU usage
- [ ] Monitor server memory usage
- [ ] Monitor disk space
- [ ] Check for any error spikes

### User Feedback
- [ ] Monitor user reports
- [ ] Check analytics for errors
- [ ] Review any support tickets
- [ ] Check social media mentions

### Performance Metrics
- [ ] Page load times
- [ ] Image load times
- [ ] Server response times
- [ ] Error rates
- [ ] User engagement metrics

## Rollback Plan (If Needed)

### Quick Rollback
1. [ ] Stop current servers
2. [ ] Restore backup code
3. [ ] Restart servers
4. [ ] Verify old version works
5. [ ] Investigate issues

### Database Rollback (If paths were changed)
1. [ ] Stop servers
2. [ ] Restore database backup
3. [ ] Verify data integrity
4. [ ] Restart servers
5. [ ] Test functionality

## Issue Resolution

### If Images Don't Load

#### Check 1: Asset Path
```bash
# Verify assets directory exists
ls -la src/assets/

# Check if backend can access it
curl http://localhost:3000/assets/hero-borobudur.jpg -I
```
- [ ] Assets directory exists
- [ ] Backend serves assets correctly

#### Check 2: CORS
```bash
# Check CORS headers
curl -I https://museumcagarbudaya.kemenbud.go.id/assets/hero-borobudur.jpg
```
- [ ] CORS headers present
- [ ] Access-Control-Allow-Origin set correctly

#### Check 3: Security Headers
- [ ] Check `public/_headers` file deployed
- [ ] Verify Cross-Origin-Resource-Policy is cross-origin
- [ ] Check browser console for security errors

#### Check 4: Backend Logs
```bash
pm2 logs backend-app --lines 100
```
- [ ] No errors in logs
- [ ] Asset requests logged
- [ ] No permission errors

### If CORS Errors Occur
1. [ ] Verify backend CORS configuration
2. [ ] Check production domain in allowed origins
3. [ ] Restart backend server
4. [ ] Clear browser cache
5. [ ] Test again

### If 404 Errors Occur
1. [ ] Check asset file exists
2. [ ] Verify path transformation working
3. [ ] Check backend static file serving
4. [ ] Review nginx/proxy configuration (if applicable)
5. [ ] Check file permissions

## Success Criteria

### Must Have (Critical)
- [x] Core utilities implemented
- [x] CORS configured for production
- [x] Security headers updated
- [x] HeroSection updated
- [ ] Images load on homepage
- [ ] No console errors
- [ ] No 404 errors

### Should Have (Important)
- [ ] All image types load correctly
- [ ] Performance is acceptable
- [ ] Mobile view works
- [ ] Caching works properly

### Nice to Have (Optional)
- [ ] All components updated
- [ ] Database paths migrated
- [ ] Documentation complete
- [ ] Monitoring in place

## Sign-Off

### Deployment Team
- [ ] Developer: _________________ Date: _______
- [ ] Reviewer: _________________ Date: _______
- [ ] Tester: ___________________ Date: _______

### Production Verification
- [ ] Production Manager: ________ Date: _______
- [ ] Technical Lead: ____________ Date: _______

### Notes
```
Deployment Date: _______________
Deployment Time: _______________
Deployed By: ___________________
Issues Encountered: ____________
Resolution: ____________________
```

## Post-Deployment Actions

### Immediate (Within 1 Hour)
- [ ] Send deployment notification
- [ ] Update status page
- [ ] Monitor error rates
- [ ] Check user feedback

### Short Term (Within 24 Hours)
- [ ] Review all metrics
- [ ] Update documentation
- [ ] Plan remaining component updates
- [ ] Schedule follow-up review

### Long Term (Within 1 Week)
- [ ] Update remaining components
- [ ] Migrate database paths (if needed)
- [ ] Optimize performance
- [ ] Complete documentation

## Resources

- **Quick Start**: `QUICK_START_IMAGE_FIX.md`
- **Full Guide**: `PRODUCTION_IMAGE_FIX_GUIDE.md`
- **Summary**: `IMAGE_FIX_SUMMARY.md`
- **Deploy Script**: `deploy-image-fix.sh`
- **Test Script**: `test-image-fix.sh`

## Emergency Contacts

```
Technical Lead: _______________
DevOps: _______________________
Database Admin: _______________
Support Team: _________________
```

---

**Status**: Ready for deployment
**Risk Level**: Low (core fix only, backward compatible)
**Estimated Downtime**: < 5 minutes
**Rollback Time**: < 10 minutes
