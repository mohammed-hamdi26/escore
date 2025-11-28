function page() {
  return (
    <div className="w-3/4 mx-auto flex flex-col justify-center h-screen gap-6 py-10">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Privacy Policy</h3>
        <p>
          Escore is a free esports utility app that does not collect, store, or
          share any personal or sensitive user data. No user account or login is
          required. We do not use any tracking tools, analytics SDKs, or
          third-party advertising services. The app does not serve personalized
          content or advertisements.
        </p>
        <p>
          All data displayed in the app is fetched from Liquipedia.net via their
          official MediaWiki API, in full compliance with their published Terms
          of Use.
        </p>
        <p>
          To enhance performance and reduce API calls, the app may cache data
          temporarily. However, no user-specific data is stored at any point.
        </p>
        <p>
          We do not collect any of the following: payment information, location
          data, or contact details.
        </p>
        If features such as user login or push notifications are introduced in
        future updates, they will be completely optional, and users will retain
        full control over notification settings within the app.
      </div>
    </div>
  );
}

export default page;
