const { default: axios } = require("axios");
const { sendProductBody } = require("./utils");

const apiUrl = process.env.API_URL;

exports.start = async (ctx) => {
  try {
    await ctx.sendMessage(
      "Ideal electrolux kompaniyasi mini pech va gaz plitalar ishlab chiqaradi",
      {
        reply_markup: {
          keyboard: [
            [{ text: "Catalogs" }],
            [{ text: "Contacts" }],
            [{ text: "Location" }],
          ],
          resize_keyboard: true,
        },
      }
    );
  } catch (error) {}
};

exports.catalogs = async (ctx) => {
  try {
    await ctx.sendChatAction("typing");
    const res = await axios.get(`${apiUrl}/api/v1/categories`);
    categories = res.data.data.categories;

    await ctx.sendMessage("Katalogni tanlang:", {
      reply_markup: {
        inline_keyboard: categories.map((category) => {
          return [
            {
              text: category.nameUz,
              callback_data: `category_${category._id}`,
            },
          ];
        }),
        resize_keyboard: true,
      },
    });
  } catch (error) {
    ctx.reply(error.message);
  }
};

exports.contacts = async (ctx) => {
  try {
    await ctx.sendChatAction("typing");

    await ctx.sendMessage(
      `Tel: +998972230001 \nTelegram: @idealelectrolux_1\nhttps://instagram.com/idealelectrolux?`
    );
  } catch (error) {
    ctx.reply(error.message);
  }
};

exports.location = async (ctx) => {
  try {
    await ctx.sendChatAction("typing");

    await ctx.sendLocation(39.418997, 67.131451, 16);
  } catch (error) {
    ctx.reply(error.message);
  }
};

exports.product = async (ctx, next) => {
  try {
    await ctx.sendChatAction("typing");

    const product = ctx.update.callback_query.data.replace("product_", "");
    const { data } = await axios.get(
      `https://ideallux-mdldl.ondigitalocean.app/api/v1/products/${product}`
    );
    await ctx.answerCbQuery();
    console.log(data.data.product.images[0].location);
    //     ctx.sendMessage(sendProductBody(data.data.product));
    await ctx.sendPhoto(data.data.product.images[0].location, {
      caption: sendProductBody(data.data.product),
      parse_mode: "HTML",
    });
  } catch (error) {
    ctx.reply(error.message);
  }
};

exports.products = async (ctx) => {
  try {
    await ctx.sendChatAction("typing");

    const category = ctx.update.callback_query.data.replace("category_", "");
    const { data } = await axios.get(
      `https://ideallux-mdldl.ondigitalocean.app/api/v1/products?category=${category}&fields=titleRu,titleUz`
    );

    await ctx.deleteMessage();
    await ctx.sendMessage("Kerakli Mahsulotni tanlang:", {
      reply_markup: {
        inline_keyboard: [
          ...data.data.products.map((category) => {
            return [
              {
                text: category.titleUz,
                callback_data: `product_${category._id}`,
              },
            ];
          }),
          [
            {
              text: "Categories",
              callback_data: `categories`,
            },
          ],
        ],
        resize_keyboard: true,
      },
    });
  } catch (error) {
    ctx.reply(error.message);
  }
};
