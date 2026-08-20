package com.example.roampals.services;

import com.example.roampals.exceptions.EmptyOptionalException;
import org.springframework.stereotype.Service;

import java.util.Optional;


//Dieses Service wird nur verwendet um Entitties aus Optionals rauszuholen egal wlche Entities das sind
@Service
public class ConversionService {

    public <T> T getEntityFromOptional(Optional<T> optional) throws EmptyOptionalException{
        if (optional.isEmpty()){
            throw new EmptyOptionalException("Unexpected empty Optional");
        }
        return optional.get();
    }


}
