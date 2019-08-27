package com.breedup;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.imagepicker.ImagePickerPackage;
import org.reactnative.camera.RNCameraPackage;
import io.invertase.firebase.database.ReactNativeFirebaseDatabasePackage;
import io.invertase.firebase.storage.ReactNativeFirebaseStoragePackage;
import io.invertase.firebase.firestore.ReactNativeFirebaseFirestorePackage;
import io.invertase.firebase.auth.ReactNativeFirebaseAuthPackage;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImagePickerPackage(),
            new RNCameraPackage(),
            new ReactNativeFirebaseDatabasePackage(),
            new ReactNativeFirebaseStoragePackage(),
            new ReactNativeFirebaseFirestorePackage(),
            new ReactNativeFirebaseAuthPackage(),
            new ReactNativeFirebaseAppPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
