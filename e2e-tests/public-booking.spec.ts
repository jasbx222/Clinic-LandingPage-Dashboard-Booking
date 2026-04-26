import { test, expect } from '@playwright/test';

test.describe('Public Booking Flow', () => {
  
  test('User can successfully book an appointment', async ({ page }) => {
    // 1. Navigate to the landing page
    await page.goto('http://localhost:5173');
    await expect(page.locator('text=احجز موعد الآن')).toBeVisible();

    // 2. Click on Book Appointment
    await page.click('text=احجز موعد الآن');
    await expect(page).toHaveURL(/.*book-appointment/);

    // 3. Select Specialty & Doctor
    await page.click('text=اختيار التخصص');
    await page.click('text=طبيب عام');
    await page.click('text=د. أحمد محمود');

    // 4. Select Date and Time
    await page.click('[aria-label="Choose date"]');
    await page.click('text=28'); // arbitrary future date
    await page.click('text=10:00 ص');

    // 5. Fill Patient Details
    await page.fill('input[name="patientName"]', 'محمد علي');
    await page.fill('input[name="phone"]', '0501234567');
    await page.fill('textarea[name="reason"]', 'فحص دوري شامل');

    // 6. Submit Booking
    await page.click('button:has-text("تأكيد الحجز")');

    // 7. Assert Success Page
    await expect(page.locator('text=تم الحجز بنجاح')).toBeVisible();
    await expect(page.locator('text=رقم الحجز:')).toBeVisible();
  });

  test('Shows error on missing required fields', async ({ page }) => {
    await page.goto('http://localhost:5173/book-appointment');
    
    // Attempt to submit directly
    await page.click('button:has-text("تأكيد الحجز")');

    // Check for inline validation errors (Zod schema validations)
    await expect(page.locator('text=اسم المريض مطلوب')).toBeVisible();
    await expect(page.locator('text=رقم الهاتف مطلوب')).toBeVisible();
  });

});
