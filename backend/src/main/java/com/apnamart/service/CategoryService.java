package com.apnamart.service;

import com.apnamart.dto.request.CategoryRequest;
import com.apnamart.dto.response.CategoryResponse;
import com.apnamart.entity.Category;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getActiveCategories();
    List<CategoryResponse> getAllCategories();
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse updateCategory(Long id, CategoryRequest request);
    CategoryResponse toggleCategoryStatus(Long id);
    Category getCategoryEntity(Long id);
}
