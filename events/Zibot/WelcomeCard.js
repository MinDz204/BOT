/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */
const { JSX, Builder, loadImage, FontFactory, Font } = require("canvacord");
class GreetingsCard extends Builder {
  constructor() {
    super(930, 280);
    this.bootstrap({
      displayName: "",
      type: "welcome",
      avatar: "",
      message: "",
    });
    if (!FontFactory.size) Font.loadDefault();
  }

  setDisplayName(value) {
    this.options.set("displayName", value);
    return this;
  }

  setType(value) {
    this.options.set("type", value);
    return this;
  }

  setAvatar(value) {
    this.options.set("avatar", value);
    return this;
  }

  setMessage(value) {
    this.options.set("message", value);
    return this;
  }

  async render() {
    const { type, displayName, avatar, message } = this.options.getOptions();

    const image = await loadImage(avatar);
    const imane = await loadImage("./events/Zibot/IMGs/welcome.png")
    return JSX.createElement(
      "img",
      {
        src: imane.toDataURL(),
        // className:
        //   "h-full w-full flex flex-col items-center justify-center bg-[#23272A] rounded-xl",
        style: {
            background: "linear-gradient(to top, #120C17, #010424, #53049c)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderRadius: "0.5rem",
            height: "100%",
            width: "100%",
          },
      },
      JSX.createElement(
        "div",
        {
          className:
            "px-6  w-[96%] h-[84%] rounded-lg flex items-center",
        },
        JSX.createElement("img", {
          src: image.toDataURL(),
          className: "flex h-[40] w-[40] rounded-full",
        }),
        JSX.createElement(
          "div",
          { className: "flex flex-col ml-6" },
          JSX.createElement(
            "h1",
            { className: "text-5xl text-white font-bold m-0" },
            type === "welcome" ? "Welcome" : "Goodbye",
            ",",
            " ",
            JSX.createElement(
              "span",
              { className: "text-blue-500" },
              displayName,
              "!"
            )
          ),
          JSX.createElement(
            "p",
            { className: "text-gray-300 text-3xl m-0" },
            message
          )
        )
      )
    );
  }
}

module.exports = { WelcomeCard: GreetingsCard };
