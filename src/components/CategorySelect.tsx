import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { CATEGORIES } from "@/constants/categories"
import { PostEditProps } from "./UpdateForm"

// PostForm에서 쓰는거
export function NativeSelectGroups() {
    return (
        <>
            <NativeSelect id="category_select" name="category_select">
                <NativeSelectOption value="">카테고리 선택</NativeSelectOption>
                <NativeSelectOptGroup label="블로그">
                    {CATEGORIES.map((c) => {
                        return (
                            <NativeSelectOption key={c.value} value={c.value}>{c.label}</NativeSelectOption>
                        )
                    })}
                </NativeSelectOptGroup>
            </NativeSelect>
        </>
  )
}

// UpdateForm에서 쓰는거
export function UpdateNativeSelectGroups({ post } : PostEditProps) {
    return (
        <>
            <NativeSelect id="category_select" name="category_select" defaultValue={post.category}>
                <NativeSelectOption value="">카테고리 선택</NativeSelectOption>
                <NativeSelectOptGroup label="블로그">
                    {CATEGORIES.map((c) => {
                        return (
                            <NativeSelectOption key={c.value} value={c.value}>{c.label}</NativeSelectOption>
                        )
                    })}
                </NativeSelectOptGroup>
            </NativeSelect>
        </>
  )
}