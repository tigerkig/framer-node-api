const {Shopify} = require('@shopify/shopify-api')
const fetch = require('node-fetch');

const domain = process.env.SHOPIFY_STORE_DOMAIN
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN
const storefrontAccessToken = process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN

async function callShopify(query) {
  const fetchUrl = `https://${domain}/api/2022-10/graphql.json`;
  console.log(fetchUrl);
  const fetchOptions = {
    endpoint: fetchUrl,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  try {
    const data = await fetch(fetchUrl, fetchOptions).then((response) =>
      response.json(),
    );
    return data;
  } catch (error) {
    throw new Error("Could not fetch products!", error);
  }
}

async function callShopifyAdmin(query){  
   
  const client = new Shopify.Clients.Graphql(
    domain,
    accessToken
  );

  const queryData = await client.query({
    data: query,
  });   

  return queryData;  
}

// Create and Save a new Tutorial
exports.getProducts = async(req, res) => {  
  const query =
    `query {
    usbCtoUsb: product(id: "gid://shopify/Product/7947937775861") {
      id
        title
        handle
        description
        images(first: 10) {
          edges {
            node {
              id
              originalSrc
              height
              width     
              altText             
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price                
            }
          }
        }
    }
    usbCtoLightning: product(id: "gid://shopify/Product/7947937808629") {
      id
        title
        handle
        description
        images(first: 10) {
          edges {
            node {
              id
              originalSrc
              height
              width     
              altText             
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price                
            }
          }
        }
    }
    usbAAdapter4pack: product(id: "gid://shopify/Product/7960203002101") {
      id
        title
        handle
        description
        images(first: 10) {
          edges {
            node {
              id
              originalSrc
              height
              width     
              altText             
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price                
            }
          }
        }
    }
    microUsbAdapter4pack: product(id: "gid://shopify/Product/7960203133173") {
      id
        title
        handle
        description
        images(first: 10) {
          edges {
            node {
              id
              originalSrc
              height
              width     
              altText             
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price                
            }
          }
        }
    }
    freeBonusLuxUsbC: product(id: "gid://shopify/Product/7960203198709") {
      id
        title
        handle
        description
        images(first: 10) {
          edges {
            node {
              id
              originalSrc
              height
              width     
              altText             
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price                
            }
          }
        }
    }
    switchToLightning: product(id: "gid://shopify/Product/7960203362549") {
      id
        title
        handle
        description
        images(first: 10) {
          edges {
            node {
              id
              originalSrc
              height
              width     
              altText             
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price                
            }
          }
        }
    }
    customGoldPlatedUsbAAdapter: product(id: "gid://shopify/Product/7960203428085") {
      id
        title
        handle
        description
        images(first: 10) {
          edges {
            node {
              id
              originalSrc
              height
              width     
              altText             
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price                
            }
          }
        }
    }
  }`
  ; 
  try {
     const response = await callShopifyAdmin(query);
    const allProducts = response.body.data
    ? response.body.data
    : []; 
    res.send(allProducts);
  }
  catch(err) {
    console.log(err)
    res.status(500).send({
      message:
        err.message || "Some error occurred while get priduct list."
    });
  } 
};

exports.getProductDetail = async(req, res) => {  
  if (!req.body.handle) {
    res.status(400).send({
      message: "handle can not be empty!"
    });
    return;
  }
  const query =
    `{
      productByHandle(handle: "${req.body.handle}") {
        id
        title
        handle
        description
        images(first: 10) {
          edges {
            node {
              id
              originalSrc
              height
              width     
              altText             
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price                
            }
          }
        }
      }
    }`
  ;

 
  try {
    const response = await callShopifyAdmin(query);
    const productDetail = response.body.data.productByHandle
      ? response.body.data.productByHandle
      : [];

    res.send(productDetail);
  }
  catch(err) {
    console.log(err)
    res.status(500).send({
      message:
        err.message || "Some error occurred while get product detail."
    });
  } 
};

exports.createCheckOut = async(req, res) => {  
  if (!req.body.id || !req.body.quantity) {
    res.status(400).send({
      message: "id and quantity can not be empty!"
    });
    return;
  }
  
  if(req.body.quantity > 1) {
    res.status(400).send({
      message: "We can't continue checkout."
    });
    return;
  } 

  const query =
  `mutation 
    {
      checkoutCreate(input: {
        lineItems: [{ variantId: "${req.body.id}", quantity: ${req.body.quantity} }]
      }) {
        checkout {
           id
           webUrl
           lineItems(first: 250) {
             edges {
               node {
                 id
                 title
                 quantity
               }
             }
           }
        }
      }
    }      
  `
;

  try {
    const response = await callShopify(query);
    const checkout = response.data.checkoutCreate.checkout
      ? response.data.checkoutCreate.checkout
      : [];

    res.send(checkout);
  }
  catch(err) {
    console.log(err)
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating checkout."
    });
  } 
};

exports.updateCheckOut = async(req, res) => {  
  if (!req.body.id || !req.body.lineItems) {
    res.status(400).send({
      message: "id and quantity can not be empty!"
    });
    return;
  }
  var bonus = 0
  const id = req.body.id
  const lineItems = req.body.lineItems
  var USBCUSBC = req.body.lineItems.find(item => item.type === 'usbCtoUsb')?.quantity
  var USBCLGT = req.body.lineItems.find(item => item.type === 'usbCtoLightning')?.quantity
  var FREEBONUS = req.body.lineItems.find(item => item.type === 'freeBonusLuxUsbC').quantity
  if(!USBCUSBC) USBCUSBC = 0
  if(!USBCLGT) USBCLGT = 0

  if(USBCUSBC == 0 && USBCLGT == 0)
    bonus = 0
  else
    bonus = Math.abs(Math.ceil((USBCUSBC + USBCLGT) / 2 - 1))

  if(bonus + 1 !== FREEBONUS) {
    res.status(400).send({
      message: "We can't continue checkout."
    });
    return;
  }

  const formattedLineItems = lineItems.map(item => {
    return `{
      variantId: "${item.variantId}",
      quantity:${item.quantity}
    }`
  })

  const query =
    `mutation 
      {
        checkoutLineItemsReplace(lineItems: [${formattedLineItems}], checkoutId: "${id}") {
          checkout {
             id
             webUrl
             lineItems(first: 250) {
               edges {
                 node {
                   id
                   title
                   quantity
                 }
               }
             }
          }
        }
      }      
    `
  ;  

  try {
    const response = await callShopify(query);

    const checkout = response.data.checkoutLineItemsReplace.checkout
      ? response.data.checkoutLineItemsReplace.checkout
      : [];

    res.send(checkout);
  }
  catch(err) {
    console.log(err)
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating checkout."
    });
  } 
};