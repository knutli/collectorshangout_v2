import React from "react";
import { cn } from "./cn";

const ProductsGrid = React.forwardRef(
  ({ children, itemClassName, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full grid-cols-1 gap-0 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ProductsGrid.displayName = "ProductsGrid";

export default ProductsGrid;
