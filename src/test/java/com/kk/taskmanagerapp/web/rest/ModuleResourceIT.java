package com.kk.taskmanagerapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.kk.taskmanagerapp.IntegrationTest;
import com.kk.taskmanagerapp.domain.Module;
import com.kk.taskmanagerapp.repository.ModuleRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ModuleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ModuleResourceIT {

    private static final String DEFAULT_MODULE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_MODULE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_START_DATE = "AAAAAAAAAA";
    private static final String UPDATED_START_DATE = "BBBBBBBBBB";

    private static final String DEFAULT_END_DATE = "AAAAAAAAAA";
    private static final String UPDATED_END_DATE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/modules";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restModuleMockMvc;

    private Module module;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Module createEntity(EntityManager em) {
        Module module = new Module().moduleName(DEFAULT_MODULE_NAME).startDate(DEFAULT_START_DATE).endDate(DEFAULT_END_DATE);
        return module;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Module createUpdatedEntity(EntityManager em) {
        Module module = new Module().moduleName(UPDATED_MODULE_NAME).startDate(UPDATED_START_DATE).endDate(UPDATED_END_DATE);
        return module;
    }

    @BeforeEach
    public void initTest() {
        module = createEntity(em);
    }

    @Test
    @Transactional
    void createModule() throws Exception {
        int databaseSizeBeforeCreate = moduleRepository.findAll().size();
        // Create the Module
        restModuleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(module)))
            .andExpect(status().isCreated());

        // Validate the Module in the database
        List<Module> moduleList = moduleRepository.findAll();
        assertThat(moduleList).hasSize(databaseSizeBeforeCreate + 1);
        Module testModule = moduleList.get(moduleList.size() - 1);
        assertThat(testModule.getModuleName()).isEqualTo(DEFAULT_MODULE_NAME);
        assertThat(testModule.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testModule.getEndDate()).isEqualTo(DEFAULT_END_DATE);
    }

    @Test
    @Transactional
    void createModuleWithExistingId() throws Exception {
        // Create the Module with an existing ID
        module.setId(1L);

        int databaseSizeBeforeCreate = moduleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restModuleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(module)))
            .andExpect(status().isBadRequest());

        // Validate the Module in the database
        List<Module> moduleList = moduleRepository.findAll();
        assertThat(moduleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkModuleNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = moduleRepository.findAll().size();
        // set the field null
        module.setModuleName(null);

        // Create the Module, which fails.

        restModuleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(module)))
            .andExpect(status().isBadRequest());

        List<Module> moduleList = moduleRepository.findAll();
        assertThat(moduleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllModules() throws Exception {
        // Initialize the database
        moduleRepository.saveAndFlush(module);

        // Get all the moduleList
        restModuleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(module.getId().intValue())))
            .andExpect(jsonPath("$.[*].moduleName").value(hasItem(DEFAULT_MODULE_NAME)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE)))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE)));
    }

    @Test
    @Transactional
    void getModule() throws Exception {
        // Initialize the database
        moduleRepository.saveAndFlush(module);

        // Get the module
        restModuleMockMvc
            .perform(get(ENTITY_API_URL_ID, module.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(module.getId().intValue()))
            .andExpect(jsonPath("$.moduleName").value(DEFAULT_MODULE_NAME))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE));
    }

    @Test
    @Transactional
    void getNonExistingModule() throws Exception {
        // Get the module
        restModuleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingModule() throws Exception {
        // Initialize the database
        moduleRepository.saveAndFlush(module);

        int databaseSizeBeforeUpdate = moduleRepository.findAll().size();

        // Update the module
        Module updatedModule = moduleRepository.findById(module.getId()).get();
        // Disconnect from session so that the updates on updatedModule are not directly saved in db
        em.detach(updatedModule);
        updatedModule.moduleName(UPDATED_MODULE_NAME).startDate(UPDATED_START_DATE).endDate(UPDATED_END_DATE);

        restModuleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedModule.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedModule))
            )
            .andExpect(status().isOk());

        // Validate the Module in the database
        List<Module> moduleList = moduleRepository.findAll();
        assertThat(moduleList).hasSize(databaseSizeBeforeUpdate);
        Module testModule = moduleList.get(moduleList.size() - 1);
        assertThat(testModule.getModuleName()).isEqualTo(UPDATED_MODULE_NAME);
        assertThat(testModule.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testModule.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void putNonExistingModule() throws Exception {
        int databaseSizeBeforeUpdate = moduleRepository.findAll().size();
        module.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModuleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, module.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(module))
            )
            .andExpect(status().isBadRequest());

        // Validate the Module in the database
        List<Module> moduleList = moduleRepository.findAll();
        assertThat(moduleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchModule() throws Exception {
        int databaseSizeBeforeUpdate = moduleRepository.findAll().size();
        module.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModuleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(module))
            )
            .andExpect(status().isBadRequest());

        // Validate the Module in the database
        List<Module> moduleList = moduleRepository.findAll();
        assertThat(moduleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamModule() throws Exception {
        int databaseSizeBeforeUpdate = moduleRepository.findAll().size();
        module.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModuleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(module)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Module in the database
        List<Module> moduleList = moduleRepository.findAll();
        assertThat(moduleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateModuleWithPatch() throws Exception {
        // Initialize the database
        moduleRepository.saveAndFlush(module);

        int databaseSizeBeforeUpdate = moduleRepository.findAll().size();

        // Update the module using partial update
        Module partialUpdatedModule = new Module();
        partialUpdatedModule.setId(module.getId());

        partialUpdatedModule.moduleName(UPDATED_MODULE_NAME).startDate(UPDATED_START_DATE);

        restModuleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModule.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedModule))
            )
            .andExpect(status().isOk());

        // Validate the Module in the database
        List<Module> moduleList = moduleRepository.findAll();
        assertThat(moduleList).hasSize(databaseSizeBeforeUpdate);
        Module testModule = moduleList.get(moduleList.size() - 1);
        assertThat(testModule.getModuleName()).isEqualTo(UPDATED_MODULE_NAME);
        assertThat(testModule.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testModule.getEndDate()).isEqualTo(DEFAULT_END_DATE);
    }

    @Test
    @Transactional
    void fullUpdateModuleWithPatch() throws Exception {
        // Initialize the database
        moduleRepository.saveAndFlush(module);

        int databaseSizeBeforeUpdate = moduleRepository.findAll().size();

        // Update the module using partial update
        Module partialUpdatedModule = new Module();
        partialUpdatedModule.setId(module.getId());

        partialUpdatedModule.moduleName(UPDATED_MODULE_NAME).startDate(UPDATED_START_DATE).endDate(UPDATED_END_DATE);

        restModuleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModule.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedModule))
            )
            .andExpect(status().isOk());

        // Validate the Module in the database
        List<Module> moduleList = moduleRepository.findAll();
        assertThat(moduleList).hasSize(databaseSizeBeforeUpdate);
        Module testModule = moduleList.get(moduleList.size() - 1);
        assertThat(testModule.getModuleName()).isEqualTo(UPDATED_MODULE_NAME);
        assertThat(testModule.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testModule.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingModule() throws Exception {
        int databaseSizeBeforeUpdate = moduleRepository.findAll().size();
        module.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModuleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, module.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(module))
            )
            .andExpect(status().isBadRequest());

        // Validate the Module in the database
        List<Module> moduleList = moduleRepository.findAll();
        assertThat(moduleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchModule() throws Exception {
        int databaseSizeBeforeUpdate = moduleRepository.findAll().size();
        module.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModuleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(module))
            )
            .andExpect(status().isBadRequest());

        // Validate the Module in the database
        List<Module> moduleList = moduleRepository.findAll();
        assertThat(moduleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamModule() throws Exception {
        int databaseSizeBeforeUpdate = moduleRepository.findAll().size();
        module.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModuleMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(module)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Module in the database
        List<Module> moduleList = moduleRepository.findAll();
        assertThat(moduleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteModule() throws Exception {
        // Initialize the database
        moduleRepository.saveAndFlush(module);

        int databaseSizeBeforeDelete = moduleRepository.findAll().size();

        // Delete the module
        restModuleMockMvc
            .perform(delete(ENTITY_API_URL_ID, module.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Module> moduleList = moduleRepository.findAll();
        assertThat(moduleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
