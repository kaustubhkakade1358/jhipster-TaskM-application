package com.kk.taskmanagerapp.repository;

import com.kk.taskmanagerapp.domain.Employee;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface EmployeeRepositoryWithBagRelationships {
    Optional<Employee> fetchBagRelationships(Optional<Employee> employee);

    List<Employee> fetchBagRelationships(List<Employee> employees);

    Page<Employee> fetchBagRelationships(Page<Employee> employees);
}
