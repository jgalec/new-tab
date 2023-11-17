import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app") as HTMLElement;
  const browserInfo = detectBrowserInfo();

  const appContent = `
  <div>
    <h1>Hello! I'm a browser extension! <i class="fa-regular fa-face-laugh-beam"></i></h1>
    <h2>You're using ${browserInfo.name}</h2>
    <h3>and its version is ${browserInfo.version}!</h3>

    <i class="fa-solid fa-cat"></i>
  </div>
`;
  app.innerHTML = appContent;
});

function detectBrowserInfo() {
  const userAgent = navigator.userAgent;

  let browserName: string | null = null;
  let browserVersion: number | null = null;

  if (/Edg/.test(userAgent)) {
    browserName = 'Edge <i class="fa-brands fa-edge"></i>';
    browserVersion = Math.floor(
      parseFloat(userAgent.substring(userAgent.indexOf("Edg") + 4))
    );
  }

  return { name: browserName, version: browserVersion };
}
