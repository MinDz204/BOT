/** @jsx JSX.createElement */
/** @jsxFrag JSX.Fragment */
const { Builder, JSX, Font, FontFactory, loadImage } = require("canvacord");
// define a builder
class Generator extends Builder {
  constructor() {
    // set the size of the image
    super(300, 300);
    this.bootstrap({
        author: "",
        image: "",
        title: "",
        coin: "",
      });
    // if no fonts are loaded, load the default font
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
  setCoin(coin) {
    this.options.set("coin", coin);
    return this;
  }

  async render() {
    const { author, image, title, coin } = this.options.getOptions();
    const art = await loadImage(image);
    const coinig = await loadImage(coin)
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
            src: coinig.toDataURL(),
            alt: "img",
            display: "flex",
            style: {
              borderRadius: "50%",
              height: "10rem",
              width: "10rem",
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
                marginTop: 0,
              },
            },
            title
          ),
          JSX.createElement("img", {
            src: art.toDataURL(),
            alt: "img",
            display: "flex",
            style: {
              borderRadius: "50%",
              height: "2rem",
              width: "2rem",
            },
          }),
          JSX.createElement(
            "h4",
            {
              style: {
                fontSize: "1.125rem",
                display: "flex",
                lineHeight: 1,
                marginTop: "0.25rem",
                color: "#FFFFFFAA",
                fontWeight: 500,
              },
            },
            author
          )
        ),
      );
    }
}
module.exports = { ZCoinFlip: Generator };



// async function main() {
//   // create an instance of the builder
//   const generator = new Generator();
//   // build the image and save it to a file
//   const image = await generator.build({ format: "png" });

//   await writeFile("image.png", image);
// }

// main();
