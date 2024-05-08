const { JSX, Builder, loadImage, FontFactory, Font } = require("canvacord");

class GreetingsCard extends Builder {
  constructor() {
    super(930, 280);
    this.bootstrap({
      displayName: "",
      type: "welcome",
      avatar: "",
      message: "",
      background: "",
    });
    // if no fonts are loaded, load the default font
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

  setBackground(value) {
    this.options.set("background", value);
    return this;
  }

  setMessage(value) {
    this.options.set("message", value);
    return this;
  }

  async render() {
    const { type, displayName, avatar, message, background } = this.options.getOptions();

    const avatarIMG = await loadImage(avatar);
    const BGIMG = await loadImage(background);
    return JSX.createElement(
      "img",
      {
        src: BGIMG.toDataURL(),
        className:
          "h-full w-full flex flex-col items-center justify-center rounded-xl",
      },
      JSX.createElement(
        "div",
        {
          className:
            "px-6 bg-[#2B2F35AA] w-[96%] h-[84%] rounded-lg flex items-center",
        },
        JSX.createElement("img", {
          src: avatarIMG.toDataURL(),
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

module.exports = { GreetingsCard };
