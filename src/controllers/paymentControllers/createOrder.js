
const mercadopago=require('mercadopago')
require('dotenv').config();
const {TOKEN_MP } = process.env;

const createOrder=async(req,res)=>{
    const data=req.body
    console.log('dataaa', data);
    const product=data.cardPey
    console.log('prtoduttt', product);
    const user=data.idUser
    console.log('iduser', user);

    try{
        mercadopago.configure({
            access_token: TOKEN_MP
        });

        const itemsProduct = product?.length>0 ? product.map(element => ({
            title: element.name,
            unit_price: parseInt(element.retail_price_cents.toString().slice(0, -2)),
            currency_id: 'ARS',
            quantity: element.quantity,
            description: element.brand_name,
            id: element.id,
            category_id: element.size
        })): [];

        console.log('itemsproduct', itemsProduct);



        const result= await mercadopago.preferences.create({
            items: itemsProduct,
            external_reference: user.id,
            installments: 1,
            back_urls:{
                success: 'https://shopconnectt.onrender.com/successfull/',
                failure: 'https://shopconnect-bj22.onrender.com/payment/failure',
                pending: 'https://shopconnect-bj22.onrender.com/payment/pending',
            },
            notification_url: 'https://shopconnect-bj22.onrender.com/payment/webhook'
        });

        console.log('result.body', result.body);

         //https://shopconnect-bj22.onrender.com/
        res.send(result.body)

    }catch(error){
        console.error(error)
        return {error: error.message}
    }
}

module.exports={createOrder}