import { BlogFooter } from "./ui/BlogFooter";
import { BlogHeader } from "./ui/BlogHeader";

export const Blog = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6.5 pl-6 pb-2.5">
      <BlogHeader />
      <div className="text-base/relaxed my-2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo alias
        iste, fuga incidunt quo id magnam corporis corrupti ducimus saepe
        aliquid accusamus provident sint officia laborum ratione dicta nemo
        inventore.
      </div>
      <BlogFooter />
    </div>
  );
};
