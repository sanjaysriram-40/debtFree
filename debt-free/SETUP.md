# Debt-Free App - Quick Start

## Prerequisites

Before running the app, ensure you have:

1. **JDK 17 or later** (Gradle 9 requirement)
2. **Android Studio** with Android SDK
3. **Android Emulator** or physical device

## Environment Setup

### 1. Install JDK 17

**Using Homebrew (macOS):**
```bash
brew install openjdk@17
```

**Set JAVA_HOME:**
```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH=$JAVA_HOME/bin:$PATH
```

To make permanent, add to `~/.zshrc`:
```bash
echo 'export JAVA_HOME=/opt/homebrew/opt/openjdk@17' >> ~/.zshrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

Verify installation:
```bash
java -version  # Should show version 17 or later
```

### 2. Setup Android Emulator

1. Open Android Studio
2. Go to **Tools** → **Device Manager**
3. Click **Create Device**
4. Select a device (e.g., Pixel 5)
5. Select Android API 33 or later
6. Click **Finish**
7. Start the emulator

## Running the App

### Option 1: Using Terminal

```bash
# Navigate to project directory
cd /Users/sanjay-18808/debt-free

# Start Metro bundler (in one terminal)
npm start

# In another terminal, run Android
npx react-native run-android
```

### Option 2: Using Physical Device

1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run: `npx react-native run-android`

## Troubleshooting

### Issue: JVM version error
```
Error: Gradle requires JVM 17 or later
```
**Solution:** Follow JDK 17 installation steps above

### Issue: No emulators found
```
Error: No emulators found as an output of `emulator -list-avds`
```
**Solution:** Start an Android emulator or connect a physical device

### Issue: Port already in use
```
Error: Port 8081 already in use
```
**Solution:** Kill existing Metro bundler:
```bash
lsof -ti:8081 | xargs kill
```

## Verify Setup

Run React Native Doctor:
```bash
npx react-native doctor
```

This will check your environment and highlight any missing dependencies.
