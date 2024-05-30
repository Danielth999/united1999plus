'use client'
import { useParams } from "next/navigation";
const FoodPackaging = () => {
  const { name } = useParams();
  return (<div>
    
    page :{name}
    </div>)
};

export default FoodPackaging;
