import {
  Select,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { CATEGORIES } from "@/constants/categories";

// PostForm에서 쓰는거
export function PostSelectGroups() {
  return (
    <Select name="category_select">
      <SelectTrigger>
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Blog</SelectLabel>
          {CATEGORIES.map((c) => {
            return (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

// UpdateForm에서 쓰는거
export function UpdateSelectGroups(category: { value: string }) {
  return (
    <Select name="category_select" defaultValue={category.value}>
      <SelectTrigger>
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Blog</SelectLabel>
          {CATEGORIES.map((c) => {
            return (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
