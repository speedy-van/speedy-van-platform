# Production Checklist — Speedy Van

## Pre-Launch
- [ ] All placeholder data replaced (phone, email, address confirmed)
- [ ] Stripe switched from test to live keys
- [ ] Stripe webhook endpoint configured for production URL
- [ ] Resend domain verified (speedy-van.co.uk)
- [ ] Mapbox token set for production
- [ ] OpenWeatherMap API key set
- [ ] Neon DB production branch created (separate from dev)
- [ ] Admin password changed from default
- [ ] Test driver account removed or password changed
- [ ] All seed data reviewed (pricing configs match business needs)
- [ ] Privacy policy reviewed by legal
- [ ] Terms & conditions reviewed by legal
- [ ] Cookie consent banner tested
- [ ] GDPR compliance checked (IP hashing, data retention)

## SEO
- [ ] Google Search Console: add property, verify, submit sitemap
- [ ] Google Business Profile: create/claim listing
- [ ] Bing Webmaster Tools: submit sitemap
- [ ] All 27 area pages have unique meta descriptions
- [ ] All 10 service pages have unique meta descriptions
- [ ] JSON-LD schemas validate (test with Google Rich Results Test)
- [ ] OG images set for social sharing
- [ ] Favicon and apple-touch-icon set
- [ ] sitemap.xml accessible at https://www.speedy-van.co.uk/sitemap.xml
- [ ] robots.txt accessible at https://www.speedy-van.co.uk/robots.txt

## Analytics
- [ ] GA4 property created, ID added to NEXT_PUBLIC_GA4_ID
- [ ] Facebook Pixel created, ID added to NEXT_PUBLIC_FB_PIXEL_ID
- [ ] TikTok Pixel created, ID added to NEXT_PUBLIC_TIKTOK_PIXEL_ID
- [ ] Conversion events verified (purchase, add_to_cart, begin_checkout)
- [ ] UTM parameter tracking tested

## iOS App
- [ ] API URL updated in iOS app to https://api.speedy-van.co.uk
- [ ] New app build submitted to App Store
- [ ] App Store listing screenshots updated
- [ ] App Store description updated with new features
- [ ] Push notifications tested (token saved via POST /driver/push-token)

## DNS & Domain
- [ ] GoDaddy DNS records updated to Vercel
- [ ] SSL certificate active (automatic via Vercel)
- [ ] www redirect configured (www → non-www or vice versa)
- [ ] api.speedy-van.co.uk resolving to API Vercel project
- [ ] Old GoDaddy site disabled

## Environment Variables (Vercel — Web project)
- [ ] DATABASE_URL set
- [ ] JWT_SECRET set
- [ ] STRIPE_SECRET_KEY set (live)
- [ ] STRIPE_PUBLISHABLE_KEY set (live)
- [ ] STRIPE_WEBHOOK_SECRET set
- [ ] NEXT_PUBLIC_MAPBOX_TOKEN set
- [ ] RESEND_API_KEY set
- [ ] OPENWEATHERMAP_API_KEY set
- [ ] NEXT_PUBLIC_API_URL=https://api.speedy-van.co.uk
- [ ] NEXT_PUBLIC_GA4_ID set
- [ ] NEXT_PUBLIC_FB_PIXEL_ID set
- [ ] NEXT_PUBLIC_TIKTOK_PIXEL_ID set

## Environment Variables (Vercel — API project)
- [ ] DATABASE_URL set
- [ ] JWT_SECRET set (same value as web)
- [ ] STRIPE_SECRET_KEY set (live)
- [ ] STRIPE_WEBHOOK_SECRET set
- [ ] RESEND_API_KEY set
- [ ] OPENWEATHERMAP_API_KEY set

## Testing
- [ ] Full booking flow: service → address → items → date → pay → confirm
- [ ] Stripe test payment successful
- [ ] Stripe live payment successful (small amount, refund after)
- [ ] Email delivery working (check spam folder)
- [ ] Driver login and job accept flow
- [ ] Admin dashboard loads with real data
- [ ] Tracking page works with real booking
- [ ] Cancel and refund flow works
- [ ] Invoice PDF downloads correctly
- [ ] Driver earnings page shows correct data
- [ ] Driver stats + leaderboard load
- [ ] Mobile responsive on iPhone, Android, iPad
- [ ] All forms validate correctly
- [ ] 404 page renders for invalid URLs
- [ ] Error pages render gracefully

## Monitoring
- [ ] Vercel deployment notifications enabled
- [ ] Error alerting set up (Vercel, Sentry, or similar)
- [ ] Uptime monitoring (UptimeRobot or similar)
- [ ] Database backup schedule confirmed (Neon handles this automatically)
