import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useProductStore from "../../store/productStore";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";
import useCartStore from "../../store/cartStore";
import { toast } from "react-toastify";



function ProductDetail() {



  //language
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language;


  //product api
  const { products, loadProducts } = useProductStore()

  useEffect(() => {
    loadProducts()
  }, [])


  //url id data
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://testaoron.limsa.uz/api/product/${id}`);
        const result = await res.json();
        setData(result?.data);
      } catch (error) {
        console.error("Xatolik:", error);
      }
    };

    fetchData();
  }, [id]);



  const [changeImg, setChengeImg] = useState(true)

  // sahifani tepaga olib chiqadi
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id])

  //open product detals
  const [openDetal, setOpenDetal] = useState(true)
  //add cards 
  const { addToCart } = useCartStore()

  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };


  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleAddToCart = () => {
    const sizeToSend = selectedSize || data?.sizes?.[0];
    const colorToSend = selectedColor || data?.colors?.[0];

    addToCart(data, quantity, sizeToSend, colorToSend);
    toast.success(t("add-card"));
  };



  return (
    <section className="container mx-auto px-10 py-10 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="aspect-square  overflow-hidden ">
            {data.images && data.images.length > 0 && (
              <img
                loading="lazy"
                src={`https://testaoron.limsa.uz/${changeImg ? data.images[0] : data.images[1]}`}
                alt="Asosiy rasm"
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
            )}
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setChengeImg(true)} className={`aspect-square w-20  p-1 transition-all ${changeImg ? "ring-2" : ""}  ring-primary`}>
              {data.images && data.images.length > 0 && (
                <img
                  loading="lazy"
                  src={`https://testaoron.limsa.uz/${data.images[0]}`}
                  alt="Asosiy rasm"
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
              )}
            </button>
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-light mb-4">{data?.[`title_${currentLang}`]}</h1>
          <div className="flex items-baseline space-x-3">
            <span className="text-xl md:text-2xl font-medium">
              ${data?.price}
            </span>
          </div>
          <p className="text-gray-500">
            {data?.[`description_${currentLang}`]}
          </p>
          <div>
            <h3 className="text-sm font-medium mb-1">{t("Material")}</h3>
            {Array.isArray(data?.materials) && data.materials.map((mat, i) => (
              <p key={i}>{mat.name} {mat.value}%</p>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">{t("Size")}</h3>
            <div className="flex flex-wrap gap-2">
              {(data?.sizes || []).map((item, ind) => (
                <button
                  onClick={() => setSelectedSize(item)}
                  className={`py-2 px-4 rounded-lg border cursor-pointer hover:bg-black/10 ${selectedSize?.id === item.id ? "bg-black text-white" : ""
                    }`} key={ind}>{item?.size}</button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">{t("Color")}</h3>
            <div className="flex items-center space-x-1 mt-2">
              {(data?.colors || []).map((item, ind) => (
                <span
                  key={ind}
                  onClick={() => setSelectedColor(item)}
                  style={{ backgroundColor: item.color_en }}
                  className={`w-7 h-7    inline-block cursor-pointer rounded-full   ${selectedColor?.id === item.id ? "border-black border-3" : ""}`} >
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">{t("Quantity")}</h3>
            <div className="flex items-center border border-input overflow-hidden rounded-md w-32">
              <button
                onClick={handleDecrease}
                className="hover:bg-gray-100 cursor-pointer w-10 h-10 flex items-center justify-center  disabled:opacity-50">-</button>
              <input
                onChange={handleInputChange}
                type="text"
                value={quantity}
                min={1}
                className="w-12 h-10 text-center border-none focus:outline-none" />
              <button
                onClick={handleIncrease}
                className="hover:bg-gray-100 cursor-pointer w-10 h-10 flex items-center justify-center ">+</button>
            </div>
          </div>
          <Link to="/">
            <button
              onClick={() => { handleAddToCart() }}
              className="w-full bg-black hover:bg-black/90 cursor-pointer py-4 rounded-[12px] text-white">{t("add-card-btn")}
            </button>
          </Link>
          <div className="border-t border-border pt-4 space-y-4">
            <div>
              <button onClick={() => setOpenDetal(!openDetal)} className=" cursor-pointer flex justify-between items-center w-full py-2">
                <h3 className="font-medium">{t("Product-Details")}</h3>
                {openDetal ?
                  <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              {/* open modal */}
              {openDetal && <div className="py-3 text-sm text-muted-foreground animate-accordion-down">
                <p>{t("Product-Details-title")}</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>{t("Product-Details-text1")}</li>
                  <li>{t("Product-Details-text2")}</li>
                  <li>{t("Color")} : {data?.colors?.[0][`color_${currentLang}`]}</li>
                  <li>{t("Size")} : {data?.sizes?.[0]?.size}</li>
                </ul>
              </div>}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <div className="flex items-center justify-between w-full mt-10">
          <p className="text-4xl font-light">{t("product-title")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-10">
          {products.slice(0, 4).map((element, index) => (
            <Link key={index} to={`/product/${element.id}`}>
              <div className="flex flex-col gap-2">
                <div className="relative group overflow-hidden cursor-pointer">
                  {element.images?.length > 0 && (
                    <img
                      loading="lazy"
                      src={`https://testaoron.limsa.uz/${element.images[0]}`}
                      alt="image"
                      className="w-full h-auto transform transition-transform duration-500 group-hover:scale-150"
                    />
                  )}
                  <p className="bg-black px-3 py-1 text-sm text-white absolute top-2">
                    NEW
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{element.title_en}</p>
                  <p>{`$${element.price}`}</p>
                </div>
                <p className="text-gray-500">
                  {element.description_en.length > 99
                    ? element.description_en.slice(
                      0,
                      element.description_en.lastIndexOf(" ", 100)
                    ) + "..."
                    : element.description_en}
                </p>
                <div className="flex gap-2 mt-2">
                  {element.colors?.map((color, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: color.color_en }}
                      title={color.color_en}
                    ></div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;

