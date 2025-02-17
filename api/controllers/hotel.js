import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";


export const createHotel = async (req,res,next)=>{
    const newHotel = new Hotel(req.body)
   
    try{
      const savedHotel = await newHotel.save()
      res.status(200).json(savedHotel)
    }catch(err){
        next(err);
    }
}

export const updateHotel = async (req,res,next)=>{
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, 
            { $set: req.body},
             { new: true}
            );
        res.status(200).json(updatedHotel);
      }catch(err){
          next(err);
      }
}

export const deleteHotel = async (req,res,next)=>{
    try{
        await Hotel.findByIdAndDelete(req.params.id);
           res.status(200).json("Hotel has been deleted");
         }catch(err){
             next(err);
         }
     }


export const getHotel = async (req,res,next)=>{
    try{
        const hotel = await Hotel.findById(req.params.id);
            res.status(200).json(hotel);
          }catch(err){
             next(err);
          }
}
export const getHotels = async (req, res, next) => {
    const { min = '1', max = '999', limit = '10', ...others } = req.query;
    try {
        const minPrice = Number(min);
        const maxPrice = Number(max);
        const resultLimit = Number(limit);

        if (isNaN(minPrice) || isNaN(maxPrice) || isNaN(resultLimit)) {
            return res.status(400).json({ message: "Invalid query parameters" });
        }

        const hotels = await Hotel.find({
            ...others,
            cheapestPrice: { $gt: minPrice, $lt: maxPrice },
        }).limit(resultLimit);

        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};

      export const countByCity = async (req,res,next)=>{
        const cities = req.query.cities.split(",")
        try{
            const list = await Promise.all(cities.map(city=>{
                return Hotel.countDocuments({city:city})
               }))
                res.status(200).json(list);
              }catch(err){
                  next(err);
              }
          }

          export const countByType = async (req,res,next)=>{
            try{
                const hotelCount = await Hotel.countDocuments({type:"hotel"});
                const apartmentCount = await Hotel.countDocuments({type:"apartment"});
                const resortCount = await Hotel.countDocuments({type:"resort"});
                const villaCount = await Hotel.countDocuments({type:"villa"});
                const cabinCount = await Hotel.countDocuments({type:"cabin"});
                  
                res.status(200).json([
                  { type: "hotel", count: hotelCount },
                  { type: "apartments", count: apartmentCount },
                  { type: "resorts", count: resortCount },
                  { type: "villas", count: villaCount },
                  { type: "cabins", count: cabinCount },
                ]);
                  }catch(err){
                      next(err);
                  }
              }
    