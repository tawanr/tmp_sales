update:
	cd frontend && eas update --channel preview --message "`git log -1 --format='%B'`"

start:
	cd frontend && npx expo start --tunnel

build-ios:
	cd frontend && eas build --platform ios --profile preview

build-android:
	cd frontend && eas build --platform android --profile preview