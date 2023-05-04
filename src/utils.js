exports.sendProductBody = (product) => {
  // x = "qweqwe".padEnd(20,"-")
  let result = `<b>${product.titleUz}</b>`;
  result += `\n\nCatalog ____ ${product.category.nameUz}`;

  product.aboutUz.forEach((about) => {
    result += `\n${about.variable} ____ ${about.value}`;
  });

  result += `\n\n${product.descriptionUz
    .replace("<p>", "")
    .replace("</p>", "")}`;
  return result;
};
