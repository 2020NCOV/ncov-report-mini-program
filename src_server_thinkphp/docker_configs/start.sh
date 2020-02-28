#!/bin/bash

# enable mod_rewrite
a2enmod rewrite
source /etc/apache2/envvars
tail -F /var/log/apache2/* &
exec apache2 -D FOREGROUND
