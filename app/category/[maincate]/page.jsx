'use client'
import { useParams } from "next/navigation";
const FoodPackaging = () => {
  const { maincate } = useParams();
  return (<div>
    
    page :{maincate}
    </div>)
};

export default FoodPackaging;
