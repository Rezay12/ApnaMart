package com.apnamart.controller;

import com.apnamart.dto.response.ApiResponse;
import com.apnamart.dto.response.CategoryResponse;
import com.apnamart.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@Tag(name = "Categories (Public)", description = "Public endpoints for categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    @Operation(summary = "List all active product categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getActiveCategories() {
        List<CategoryResponse> categories = categoryService.getActiveCategories();
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }
}
