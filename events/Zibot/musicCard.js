/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */
const { Builder, JSX, Font, FontFactory, loadImage } = require("canvacord");
class MusicCard extends Builder {
  constructor() {
    super(377, 523);
    this.bootstrap({
      author: "",
      currentTime: "00:00",
      totalTime: "00:00",
      progress: 0,
      image: "",
      title: "",
    });
    if (!FontFactory.size) Font.loadDefault();
  }

  setImage(image) {
    this.options.set("image", image);
    return this;
  }

  setTitle(title) {
    this.options.set("title", title);
    return this;
  }

  setAuthor(author) {
    this.options.set("author", author);
    return this;
  }

  setCurrentTime(time) {
    this.options.set("currentTime", time);
    return this;
  }

  setTotalTime(time) {
    this.options.set("totalTime", time);
    return this;
  }

  setProgress(progress) {
    this.options.set("progress", progress);
    return this;
  }

  async render() {
    const { author, currentTime, image, progress, title, totalTime } = this.options.getOptions();
    const art = await loadImage(image);
    return JSX.createElement(
      "div",
      {
        style: {
          background: "linear-gradient(to top, #120C17, #010424, #201C5B)",
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
      JSX.createElement("img", {
        src: art.toDataURL(),
        alt: "img",
        display: "flex",
        style: {
          borderRadius: "50%",
          height: "12rem",
          width: "12rem",
        },
      }),
      JSX.createElement(
        "div",
        {
          style: {
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        },
        JSX.createElement(
          "h1",
          {
            style: {
              fontSize: "1.5rem",
              display: "flex",
              lineHeight: 2,
              marginBottom: 0,
              marginTop: "0.75rem",
            },
          },
          title
        ),
        JSX.createElement(
          "h4",
          {
            style: {
              fontSize: "1.125rem",
              display: "flex",
              lineHeight: 1,
              marginTop: 0,
              color: "#FFFFFFAA",
              fontWeight: 500,
            },
          },
          author
        )
      ),
      JSX.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
          },
        },
        JSX.createElement(
          "div",
          {
            style: {
              position: "relative",
              height: "0.5rem",
              width: "20rem",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
            },
          },
          JSX.createElement("div", {
            style: {
              position: "absolute",
              display: "flex",
              height: "0.5rem",
              width: `${progress}%`,
              maxWidth: "20rem",
              backgroundColor: "#9333EA",
            },
          })
        ),
        JSX.createElement(
          "div",
          {
            style: {
              marginTop: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "14",
              fontWeight: "500",
              color: "#FFFFFFAA",
            },
          },
          JSX.createElement("span", null, currentTime),
          JSX.createElement("span", null, totalTime)
        )
      )
    );
  }
}

module.exports = { MusicCard };
