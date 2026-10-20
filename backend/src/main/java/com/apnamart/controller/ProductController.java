package com.apnamart.controller;

import com.apnamart.dto.response.ApiResponse;
import com.apnamart.dto.response.ProductResponse;
import com.apnamart.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Products (Public)", description = "Public endpoints for inspecting product details")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{productId}")
    @Operation(summary = "Get single product by ID")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long productId) {
        ProductResponse product = productService.getProductById(productId);
        return ResponseEntity.ok(ApiResponse.ok(product));
    }
}
