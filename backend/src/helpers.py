def update_object_attributes(object, attributes, object_update):
    for var, value in dict(object_update).items():
        if var in attributes and value is not None:
            if isinstance(value, str):
                value = value.strip()
            setattr(object, var, value)
