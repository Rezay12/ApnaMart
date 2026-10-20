package com.apnamart.service.impl;

import com.apnamart.dto.request.CategoryRequest;
import com.apnamart.dto.response.CategoryResponse;
import com.apnamart.entity.Category;
import com.apnamart.exception.BadRequestException;
import com.apnamart.exception.ResourceNotFoundException;
import com.apnamart.repository.CategoryRepository;
import com.apnamart.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findAllByActiveTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        String cleanName = request.getName().trim();
        if (categoryRepository.existsByNameIgnoreCase(cleanName)) {
            throw new BadRequestException("Category with name '" + cleanName + "' already exists");
        }
        Category category = new Category(cleanName, request.getDescription(), request.getIconName());
        return toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = getCategoryEntity(id);
        String cleanName = request.getName().trim();
        if (!category.getName().equalsIgnoreCase(cleanName) && categoryRepository.existsByNameIgnoreCase(cleanName)) {
            throw new BadRequestException("Category with name '" + cleanName + "' already exists");
        }
        category.setName(cleanName);
        category.setDescription(request.getDescription());
        category.setIconName(request.getIconName());
        return toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryResponse toggleCategoryStatus(Long id) {
        Category category = getCategoryEntity(id);
        category.setActive(!category.isActive());
        return toResponse(categoryRepository.save(category));
    }

    @Override
    public Category getCategoryEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getIconName(),
                category.isActive()
        );
    }
}
