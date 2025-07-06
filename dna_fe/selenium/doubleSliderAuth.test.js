const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function testDoubleSliderAuthUI() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://localhost:3000/auth');

    // === 1. Đảm bảo đang ở chế độ login ===
    await driver.wait(until.elementLocated(By.css('form.auth-form')), 10000);
    console.log('✅ Đã vào giao diện đăng nhập');

    const loginInputs = await driver.findElements(By.css('.auth-input'));
    if (loginInputs.length >= 2) console.log('✅ Có đủ input đăng nhập');

    // === 2. Chuyển sang chế độ register và kiểm tra ===
    const switchBtn = await driver.findElement(By.css('.auth-switch-btn'));
    await switchBtn.click();
    await driver.sleep(500); // đợi animation nếu có

    const registerForm = await driver.findElement(By.css('form.auth-form'));
    const registerInputs = await registerForm.findElements(By.css('.auth-input'));
    if (registerInputs.length >= 5) console.log('✅ Có đủ input đăng ký');

   // === 3. Chuyển sang quên mật khẩu ===
// Nhấn lại để chắc chắn đang ở login (nếu bị ở chế độ register)
const switchBackBtn = await driver.findElement(By.css('.auth-switch-btn'));
await switchBackBtn.click();
await driver.sleep(500);

// Đảm bảo đang có thẻ "Quên mật khẩu?"
await driver.wait(until.elementLocated(By.linkText('Quên mật khẩu?')), 3000);
const forgotLink = await driver.findElement(By.linkText('Quên mật khẩu?'));
await forgotLink.click();

await driver.wait(until.elementLocated(By.css('form.auth-form')), 5000);
const emailInput = await driver.findElement(By.css('input[type="email"]'));
console.log('✅ Giao diện quên mật khẩu hiển thị');

    // === 4. Giả lập token đặt lại mật khẩu ===
    await driver.executeScript("window.history.pushState({}, '', '/auth?token=testtoken123');");
    await driver.navigate().refresh();

    await driver.wait(until.elementLocated(By.css('form.auth-form')), 5000);
    const newPasswordInput = await driver.findElement(By.css('input[placeholder="Mật khẩu mới"]'));
    const confirmPasswordInput = await driver.findElement(By.css('input[placeholder="Xác nhận mật khẩu"]'));
    console.log('✅ Giao diện đặt lại mật khẩu hiển thị');

    // === 5. Nhập thử giá trị ===
    await newPasswordInput.sendKeys('Test@1234');
    await confirmPasswordInput.sendKeys('Test@1234');
    console.log('✅ Nhập mật khẩu mới hoàn tất');

    console.log('🎉 Tất cả kiểm tra UI cơ bản hoàn tất!');

  } catch (err) {
    console.error('❌ Lỗi khi test:', err.message);
  } finally {
    await driver.quit();
  }
})();



// cách chạy          serve -s build -l 3000                  node selenium/doubleSliderAuth.test.js

// Bước tiếp theo: Xem giao diện trực quan trong Applitools Dashboard
// Truy cập https://eyes.applitools.com


// const { Builder, By, until } = require('selenium-webdriver');
// const { Eyes, Target, ClassicRunner, Configuration, BatchInfo } = require('@applitools/eyes-selenium');
// require('chromedriver');

// (async function testDoubleSliderAuthUI() {
//   const driver = await new Builder().forBrowser('chrome').build();

//   // Khởi tạo Applitools Eyes
//   const runner = new ClassicRunner();
//   const eyes = new Eyes(runner);

//   const config = new Configuration();
//   config.setApiKey(process.env.APPLITOOLS_API_KEY || '3rcZWrZWpzGDQXSrdKMcdvCyqZIgh1qhL8HtZv8x1072s110'); // nên dùng biến môi trường
//   config.setAppName('DNA Auth');
//   config.setTestName('DoubleSliderAuth UI Test');
//   config.setBatch(new BatchInfo('DNA Auth UI'));

//   eyes.setConfiguration(config);

//   try {
//     await eyes.open(driver);

//     await driver.get('http://localhost:3000/auth');

//     await driver.wait(until.elementLocated(By.css('form.auth-form')), 10000);
//     console.log('✅ Đã vào giao diện đăng nhập');

//     // 👉 Snapshot UI Login
//     await eyes.check('Login Form', Target.window());

//     const loginInputs = await driver.findElements(By.css('.auth-input'));
//     if (loginInputs.length >= 2) console.log('✅ Có đủ input đăng nhập');

//     // === 2. Chuyển sang Register ===
//     const switchBtn = await driver.findElement(By.css('.auth-switch-btn'));
//     await switchBtn.click();
//     await driver.sleep(500);

//     await driver.wait(until.elementLocated(By.css('form.auth-form')), 3000);
//     const registerInputs = await driver.findElements(By.css('.auth-input'));
//     if (registerInputs.length >= 5) console.log('✅ Có đủ input đăng ký');

//     // 👉 Snapshot UI Register
//     await eyes.check('Register Form', Target.window());

//     // === 3. Chuyển sang Forgot Password ===
//     await switchBtn.click();
//     await driver.sleep(500);

//     await driver.wait(until.elementLocated(By.linkText('Quên mật khẩu?')), 3000);
//     const forgotLink = await driver.findElement(By.linkText('Quên mật khẩu?'));
//     await forgotLink.click();

//     await driver.wait(until.elementLocated(By.css('form.auth-form')), 5000);
//     const emailInput = await driver.findElement(By.css('input[type="email"]'));
//     console.log('✅ Giao diện quên mật khẩu hiển thị');

//     // 👉 Snapshot UI Forgot Password
//     await eyes.check('Forgot Password Form', Target.window());

//     // === 4. Giả lập Reset Token ===
//     await driver.executeScript("window.history.pushState({}, '', '/auth?token=testtoken123');");
//     await driver.navigate().refresh();

//     await driver.wait(until.elementLocated(By.css('form.auth-form')), 5000);
//     const newPasswordInput = await driver.findElement(By.css('input[placeholder=\"Mật khẩu mới\"]'));
//     const confirmPasswordInput = await driver.findElement(By.css('input[placeholder=\"Xác nhận mật khẩu\"]'));
//     console.log('✅ Giao diện đặt lại mật khẩu hiển thị');

//     // 👉 Snapshot UI Reset Password
//     await eyes.check('Reset Password Form', Target.window());

//     // === 5. Nhập dữ liệu demo ===
//     await newPasswordInput.sendKeys('Test@1234');
//     await confirmPasswordInput.sendKeys('Test@1234');
//     console.log('✅ Nhập mật khẩu mới hoàn tất');

//     console.log('🎉 Tất cả kiểm tra UI hoàn tất!');

//     await eyes.close(); // Kết thúc kiểm thử Applitools

//   } catch (err) {
//     console.error('❌ Lỗi khi test:', err.message);
//     await eyes.abort(); // Nếu lỗi, huỷ session
//   } finally {
//     await driver.quit();
//   }

//   const allResults = await runner.getAllTestResults(false);
//   console.log(allResults);
// })();