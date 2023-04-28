package com.kk.taskmanagerapp.service.impl;

import com.kk.taskmanagerapp.domain.Module;
import com.kk.taskmanagerapp.repository.ModuleRepository;
import com.kk.taskmanagerapp.service.ModuleService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Module}.
 */
@Service
@Transactional
public class ModuleServiceImpl implements ModuleService {

    private final Logger log = LoggerFactory.getLogger(ModuleServiceImpl.class);

    private final ModuleRepository moduleRepository;

    public ModuleServiceImpl(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    @Override
    public Module save(Module module) {
        log.debug("Request to save Module : {}", module);
        return moduleRepository.save(module);
    }

    @Override
    public Module update(Module module) {
        log.debug("Request to update Module : {}", module);
        return moduleRepository.save(module);
    }

    @Override
    public Optional<Module> partialUpdate(Module module) {
        log.debug("Request to partially update Module : {}", module);

        return moduleRepository
            .findById(module.getId())
            .map(existingModule -> {
                if (module.getModuleName() != null) {
                    existingModule.setModuleName(module.getModuleName());
                }
                if (module.getStartDate() != null) {
                    existingModule.setStartDate(module.getStartDate());
                }
                if (module.getEndDate() != null) {
                    existingModule.setEndDate(module.getEndDate());
                }

                return existingModule;
            })
            .map(moduleRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Module> findAll(Pageable pageable) {
        log.debug("Request to get all Modules");
        return moduleRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Module> findOne(Long id) {
        log.debug("Request to get Module : {}", id);
        return moduleRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Module : {}", id);
        moduleRepository.deleteById(id);
    }
}
