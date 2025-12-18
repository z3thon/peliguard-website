# Assets Inventory - Old Site to New Site

## Images Available from Old Site

### 1. Logo ✅ (Currently Used)
**File:** `Peliguard-Icon-Color.png`
**URL:** `https://images.squarespace-cdn.com/content/v1/637f783c6a76884fff870b73/035599f5-c8b9-45ac-8f0d-37519415b5ba/Peliguard-Icon-Color.png?format=1500w`
**Current Usage:** Navbar, Footer
**Status:** ✅ Already integrated
**Recommendation:** Keep as-is

---

### 2. Hero Background Image 📸 (Recommended for Home Page)
**File:** `iStock-1043592626.jpg`
**URL:** `https://images.squarespace-cdn.com/content/v1/637f783c6a76884fff870b73/8ae3a38f-a83a-484d-8294-9b449419897b/iStock-1043592626.jpg`
**Dimensions:** 7157 x 4777 pixels
**File Size:** Large (needs optimization)
**Location Found:** Home page (`index.html`)

**Suggested Usage:**
- Hero section background on Home page
- Overlay with gradient for text readability
- Alternative: Use in "Made in USA" section

**Why Use:**
- Professional manufacturing/industrial imagery
- Reinforces "Made in USA" and quality manufacturing message
- High resolution allows for cropping/zooming
- More authentic than placeholder/emoji icons

**Implementation:**
```tsx
// In Home page hero section
<div className="hero-background-image">
  <Image
    src="https://images.squarespace-cdn.com/content/v1/637f783c6a76884fff870b73/8ae3a38f-a83a-484d-8294-9b449419897b/iStock-1043592626.jpg"
    alt="American manufacturing facility"
    fill
    className="object-cover"
    priority
    quality={85}
  />
  <div className="hero-overlay" />
</div>
```

**Optimization Needed:**
- Convert to WebP format
- Compress for web (target: <500KB)
- Create responsive sizes (mobile, tablet, desktop)
- Add blur placeholder for loading

---

### 3. Facility/Process Image 📸 (Recommended for Our Story Section)
**File:** `Capture.JPG`
**URL:** `https://images.squarespace-cdn.com/content/v1/637f783c6a76884fff870b73/cc4c7fb0-47d1-4314-b3c7-1b4d9cf9cc3a/Capture.JPG`
**Dimensions:** 1294 x 611 pixels
**File Size:** Medium (needs optimization)
**Location Found:** Our Story page (`our-story.html`)

**Suggested Usage:**
- "Our Story" section on Home page
- "How It Works" section
- "Made in Louisiana" card image
- Contact page (facility visit section)

**Why Use:**
- Shows actual facility/process
- Adds authenticity and credibility
- Visual proof of "Made in Independence, Louisiana"
- Better than emoji icons for professional appearance

**Implementation:**
```tsx
// In Our Story section
<div className="story-image">
  <Image
    src="https://images.squarespace-cdn.com/content/v1/637f783c6a76884fff870b73/cc4c7fb0-47d1-4314-b3c7-1b4d9cf9cc3a/Capture.JPG"
    alt="Peliguard facility in Independence, Louisiana"
    width={1294}
    height={611}
    className="rounded-lg"
    quality={85}
  />
</div>
```

**Optimization Needed:**
- Convert to WebP format
- Compress for web (target: <200KB)
- Create responsive sizes
- Add lazy loading

---

## Image Usage Strategy

### Home Page Visual Hierarchy:
1. **Hero Section:** Use `iStock-1043592626.jpg` as background
   - Creates strong first impression
   - Reinforces manufacturing quality message

2. **Our Story Section:** Use `Capture.JPG` 
   - Shows actual facility
   - Adds credibility to "Made in Louisiana" claim

3. **Key Features/Benefits:** Keep emoji icons OR replace with:
   - Custom icons (if budget allows)
   - Product photos (if available)
   - Process photos (if available)

### Contact Page Visual Enhancements:
1. **Facility Visit Section:** Use `Capture.JPG`
   - Shows what visitors will see
   - Encourages facility visits

---

## Assets NOT Found (Potential Additions)

### Missing Assets That Would Be Valuable:
1. **Product Images**
   - Actual PPE products
   - Packaging
   - Quality control process

2. **Team Photos**
   - American workers
   - Facility staff
   - Quality control team

3. **Process Images**
   - Manufacturing process
   - Quality control steps
   - Packaging/shipping

4. **Certifications**
   - FDA approval certificates
   - ISO certifications
   - Made in USA certifications

**Recommendation:** If these exist, they should be added to:
- Home page (Features/Quality sections)
- Our Story section
- Contact page (credibility)

---

## Image Optimization Checklist

### For Each Image:
- [ ] Convert to WebP format
- [ ] Compress to optimal file size
- [ ] Create responsive sizes (mobile, tablet, desktop)
- [ ] Add proper alt text
- [ ] Add lazy loading (except hero)
- [ ] Add blur placeholder
- [ ] Test on different devices
- [ ] Verify accessibility (contrast, alt text)

### Tools Recommended:
- **Image Optimization:** Sharp, ImageOptim, Squoosh
- **Format Conversion:** WebP converter
- **Compression:** TinyPNG, ImageOptim
- **Responsive Images:** Next.js Image component (already using)

---

## Implementation Priority

### High Priority:
1. ✅ Logo (already done)
2. 📸 Hero background image (`iStock-1043592626.jpg`)
3. 📸 Facility image (`Capture.JPG`)

### Medium Priority:
4. Product images (if available)
5. Process images (if available)

### Low Priority:
6. Team photos (if available)
7. Certification badges (if available)

---

## Notes

- All images are currently hosted on Squarespace CDN
- Consider migrating to your own CDN/Next.js public folder for better control
- Images can be downloaded and optimized locally, then uploaded to Next.js public folder
- Current URLs will work but may be slower than self-hosted images

---

## Quick Reference: Image URLs

```typescript
export const ASSETS = {
  logo: 'https://images.squarespace-cdn.com/content/v1/637f783c6a76884fff870b73/035599f5-c8b9-45ac-8f0d-37519415b5ba/Peliguard-Icon-Color.png?format=1500w',
  
  heroBackground: 'https://images.squarespace-cdn.com/content/v1/637f783c6a76884fff870b73/8ae3a38f-a83a-484d-8294-9b449419897b/iStock-1043592626.jpg',
  
  facility: 'https://images.squarespace-cdn.com/content/v1/637f783c6a76884fff870b73/cc4c7fb0-47d1-4314-b3c7-1b4d9cf9cc3a/Capture.JPG',
};
```

