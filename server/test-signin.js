// Quick test script for signin feature
const email = 'signin-test-' + Date.now() + '@example.com';
const password = 'SigninTest123';

async function testSigninFlow() {
  try {
    // Step 1: Signup
    console.log('=== STEP 1: SIGNUP ===');
    const signupResponse = await fetch('http://localhost:3000/api/trainers/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        fullName: 'Signin Test User',
        department: 'ICT'
      })
    });

    const signupData = await signupResponse.json();
    console.log(`Status: ${signupResponse.status}`);
    console.log(JSON.stringify(signupData, null, 2));

    if (!signupResponse.ok) {
      throw new Error(`Signup failed: ${signupData.error}`);
    }

    const trainerId = signupData.id;
    console.log(`\n✓ Signup successful. Trainer ID: ${trainerId}`);

    // Step 2: Signin with correct password
    console.log('\n=== STEP 2: SIGNIN (CORRECT PASSWORD) ===');
    const signinResponse = await fetch('http://localhost:3000/api/trainers/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password
      })
    });

    const signinData = await signinResponse.json();
    console.log(`Status: ${signinResponse.status}`);
    console.log(JSON.stringify(signinData, null, 2));

    if (!signinResponse.ok) {
      throw new Error(`Signin failed: ${signinData.error}`);
    }

    console.log(`\n✓ Signin successful. Email verified: ${signinData.email}`);

    // Step 3: Signin with wrong password
    console.log('\n=== STEP 3: SIGNIN (WRONG PASSWORD) ===');
    const wrongPasswordResponse = await fetch('http://localhost:3000/api/trainers/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'WrongPassword123'
      })
    });

    const wrongPasswordData = await wrongPasswordResponse.json();
    console.log(`Status: ${wrongPasswordResponse.status}`);
    console.log(JSON.stringify(wrongPasswordData, null, 2));

    if (wrongPasswordResponse.status === 401) {
      console.log(`\n✓ Correctly rejected wrong password`);
    } else {
      throw new Error('Should reject wrong password with 401');
    }

    // Step 4: Signin with non-existent email
    console.log('\n=== STEP 4: SIGNIN (EMAIL NOT FOUND) ===');
    const notFoundResponse = await fetch('http://localhost:3000/api/trainers/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent-' + Date.now() + '@example.com',
        password: 'AnyPassword123'
      })
    });

    const notFoundData = await notFoundResponse.json();
    console.log(`Status: ${notFoundResponse.status}`);
    console.log(JSON.stringify(notFoundData, null, 2));

    if (notFoundResponse.status === 401) {
      console.log(`\n✓ Correctly rejected non-existent email`);
    } else {
      throw new Error('Should reject non-existent email with 401');
    }

    console.log('\n\n✅ ALL SIGNIN TESTS PASSED ✅');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    process.exit(1);
  }
}

testSigninFlow();
