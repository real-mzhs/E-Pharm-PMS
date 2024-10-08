import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import ProductsDataTable from "@/pages/product/ProductsDataTable.tsx";

const Products = () => {
  return (
    <div className="p-6 space-y-6 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
        <Button asChild>
          <Link to="/dashboard/products/new">
            <Plus className="h-4 w-4" />
            <p>Add Product</p>
          </Link>
        </Button>
      </div>
      <ProductsDataTable />
    </div>
  );
};

export default Products;
