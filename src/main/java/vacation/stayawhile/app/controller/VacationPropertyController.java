package vacation.stayawhile.app.controller;

import vacation.stayawhile.app.model.VacationProperty;
import vacation.stayawhile.app.service.VacationPropertyService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class VacationPropertyController {

    @Autowired
    private VacationPropertyService vacationPropertyService;

    @PostMapping
    public ResponseEntity<List<VacationProperty>> receiveProperties(@RequestBody List<VacationProperty> properties) {
        System.out.println("Received " + properties.size() + " properties");
        
        List<VacationProperty> savedProperties = new java.util.ArrayList<>();
        
        for (VacationProperty property : properties) {
            VacationProperty saved = vacationPropertyService.saveProperty(property);
            savedProperties.add(saved);
        }
        
        return ResponseEntity.ok(savedProperties);
    }

    @PostMapping("/single")
    public ResponseEntity<VacationProperty> receiveSingleProperty(@RequestBody VacationProperty property) {
        System.out.println("Received single property: " + property.getTitle());
        
        VacationProperty saved = vacationPropertyService.saveProperty(property);
        
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<VacationProperty>> getAllProperties() {
        List<VacationProperty> properties = vacationPropertyService.getAllProperties();
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VacationProperty> getPropertyById(@PathVariable String id) {
        VacationProperty property = vacationPropertyService.getPropertyById(id);
        if (property != null) {
            return ResponseEntity.ok(property);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable String id) {
        vacationPropertyService.deleteProperty(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<VacationProperty>> getPropertiesByCity(@PathVariable String city) {
        List<VacationProperty> properties = vacationPropertyService.getPropertiesByCity(city);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<VacationProperty>> getPropertiesByTag(@PathVariable String tag) {
        List<VacationProperty> properties = vacationPropertyService.getPropertiesByTag(tag);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/range")
    public ResponseEntity<List<VacationProperty>> getPropertiesByIndexRange(
            @RequestParam int start, 
            @RequestParam int end) {
        List<VacationProperty> properties = vacationPropertyService.getPropertiesByIndexRange(start, end);
        return ResponseEntity.ok(properties);
    }
}
