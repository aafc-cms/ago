#!/bin/bash

printf "execute post_install.sh\n";

trap "sudo configureSettingsFile" SIGINT SIGTERM
#set -x
RED='\033[0;31m'
VERT='\033[0;32m'
BOLD='\033[1m' # BOLD
NC='\033[0m' # No Color

live=0
if [ -z $ENV_NAME ]; then
  # Do nothing.
  sed -i "s+^error_level: .*$+error_level: all+g" custom/config/splits/dev/system.logging.yml
else
  if [ $ENV_NAME == "prod" ]; then
    sed -i "s+^error_level: .*$+error_level: some+g" custom/config/splits/live/system.logging.yml
  else
    sed -i "s+^error_level: .*$+error_level: all+g" custom/config/splits/dev/system.logging.yml
    sed -i "s+^error_level: .*$+error_level: all+g" custom/config/splits/live/system.logging.yml
  fi
fi
if [ -z $1 ]; then
  echo "dev environment setup.";
  if [ -f custom/config/splits/dev/git_status.settings.yml ]; then
    sed -i "s+^repository_root: .*$+repository_root: `pwd`+g" custom/config/splits/dev/git_status.settings.yml
  fi
else
  if [ $1 == "live" ]; then
    echo "live environment setup.";
    live=1
  fi
fi
configureSettingsFile () {
  if [ ! -f html/sites/default/settings.php ]; then
    printf "Creating your settings.php file\n";
    chmod 775 html/sites/default;
    cp html/sites/default/default.settings.php html/sites/default/settings.php
    chmod 664 html/sites/default/settings.php
    chown --reference=. html/sites/default/settings.php
    mkdir html/sites/default/files
    chown --reference=. html/sites/default/files
    chmod 775 html/sites/default/files
  fi

  settings_file=html/sites/default/settings.php;
  settings_local_file=html/sites/default/settings.local.php;

  if [ ! -f $settings_local_file ]; then
    touch $settings_local_file
    echo "<?php" >> $settings_local_file;
    echo "" >> $settings_local_file;
  fi
  if ! grep -q "wxt config_sync_directory" $settings_file; then
    printf "Setting your config sync folder to modules/custom/config\n";
    chmod 664 $settings_file;
    echo "//wxt config_sync_directory" >> $settings_file;
    echo "\$settings['config_sync_directory'] = 'modules/custom/config/sync';" >> $settings_file;
    hashsalt=`drush php-eval 'echo \Drupal\Component\Utility\Crypt::randomBytesBase64(55)'`;
    echo "\$settings['hash_salt'] = '$hashsalt';" >> $settings_file;
  fi
  if ! grep -q 'sites/default/files/private' $settings_local_file; then
    if ! grep -q 'file_private_path' $settings_local_file; then
      echo "\$settings['file_private_path'] = 'sites/default/files/private';" >> $settings_local_file;
    fi
  fi
  if ! grep -q '^if (file_exists($app_ro' $settings_file; then
    echo "";
    echo "if (file_exists(\$app_root . '/' . \$site_path . '/settings.local.php')) {" >> $settings_file;
    echo "  include \$app_root . '/' . \$site_path . '/settings.local.php';" >> $settings_file;
    echo "}" >> $settings_file;
  fi

  if ! grep -q "STRICT_TRANS_TABLES" $settings_file; then
    echo "`hostname`" > temptesthostname.txt
    if ! grep -q "ryzen" temptesthostname.txt; then
      echo "Drupal 9 no longer needs the init_commands because we switch to mysql 5.7";
#      search_str="^( +)'driver' => 'mysql',"
#      new_db_init="\1'driver' => 'mysql',\n    'init_commands' => [\n      'sql_mode' => \"SET sql_mode = 'STRICT_TRANS_TABLES,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,TRADITIONAL,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION'\",\n    ],"
#      sed -r "s/${search_str}/${new_db_init}/gm" $settings_file > ${settings_file}_temp;
#      cp ${settings_file}_temp ${settings_file}
    else
      echo "This environment does not need the init_commands";
    fi
    rm temptesthostname.txt
  fi
  if ! grep -q "config_split.config_split.dev" $settings_file; then
    printf "Setting up config_split for the first time.";
    chmod 775 html/sites/default;
    chmod 664 $settings_file;
    echo "\$config['config_split.config_split.dev']['status'] = TRUE; #config split DEV, do not remove this" >> $settings_file;
    echo "\$config['config_split.config_split.live']['status'] = FALSE; #config split LIVE, do not remove this" >> $settings_file;
  fi

  if [ $live -eq 1 ]; then
    chmod 775 html/sites/default;
    chmod 664 $settings_file;
    ./post_install_helper.php "force_split=live";
  else
    chmod 775 html/sites/default;
    chmod 664 $settings_file;
    ./post_install_helper.php "force_split=dev";
  fi

  # Fix previously configured environments.
  ./post_install_helper.php file_path="$settings_file" old_text="'modules/custom/config'" new_text="'modules/custom/config/sync'"

}

configureSettingsFile


if [ -d "html/libraries" ]; then
  echo "Begin upgrade of gcweb library from 10.something to 14.5.0 and wet-boew from 4.0.50 to 4.0.74."
  pushd html/libraries;
  rm tmp -rf;
  mkdir tmp;
  pushd tmp;
  wget https://github.com/wet-boew/wet-boew/releases/download/v4.0.74/wet-boew-dist-4.0.74.zip
  wget https://github.com/wet-boew/GCWeb/releases/download/v14.5.0/themes-dist-14.5.0-gcweb.zip
  unzip wet-boew-dist-4.0.74.zip
  mv ../wet-boew wet-boew_orig
  mv wet-boew-dist-4.0.74/wet-boew ../
  unzip themes-dist-14.5.0-gcweb.zip
  mv ../theme-gcweb theme-gcweb_orig
  mv themes-dist-14.5.0-gcweb/GCWeb ../theme-gcweb
  popd
  rm ../libraries/tmp -r;
  popd;
  echo "End of upgrade for the gcweb library, now upgraded to gcweb 14.5.0 and wet-boew 4.0.74."
fi
if [ -f custom/splash/.htaccess ]; then
  cp custom/splash/.htaccess html/.htaccess
fi
htaccess_file=html/.htaccess
robotstxt_file=html/robots.txt
if ! grep -q "splash.php" $htaccess_file; then
   echo "Adding a rewrite rule for splash page."
   sed -i '90 i RewriteRule "^$" splash.php [L]' $htaccess_file;
fi
if ! grep -q "mac_feedback" $htaccess_file; then
   search_str="^( +)# Allow access to test-specific PHP files:";
   new_setting="\1# Allow access to custom aafc PHP files:\n\1RewriteCond \%\{REQUEST_URI\} \!\/resources\/prod\/Internet-Internet\/MISB-DGSIM\/ATS-SEA\/includes\/mac_feedback_handler.php\$\n\1# Allow access to test-specific PHP files:\n";
   sed -r "s/${search_str}/${new_setting}/gm" $htaccess_file > ${htaccess_file}_temp;
   cp ${htaccess_file}_temp ${htaccess_file}
fi
if ! grep -q "embeddedMap" $htaccess_file; then
   search_str="^( +)# Allow access to test-specific PHP files:";
   new_setting="\1# Allow access to custom aafc js files:\n\1RewriteCond \%\{REQUEST_URI\} \!\/atlas\/API\/js\/embeddedMap_1.3.js\$\n\1# Allow access to test-specific PHP files:\n";
   sed -r "s/${search_str}/${new_setting}/gm" $htaccess_file > ${htaccess_file}_temp;
   cp ${htaccess_file}_temp ${htaccess_file}
fi
if ! grep -q "apps/ewi/index" $htaccess_file; then
   search_str="^( +)# Allow access to test-specific PHP files:";
   new_setting="\1# Allow access to custom aafc iframe files:\n\1RewriteCond \%\{REQUEST_URI\} \!\/atlas\/API\/apps\/ewi\/index.html\$\n\1# Allow access to test-specific ewi index.html files:\n";
   sed -r "s/${search_str}/${new_setting}/gm" $htaccess_file > ${htaccess_file}_temp;
   cp ${htaccess_file}_temp ${htaccess_file}
fi
if ! grep -q "lang=fr" $htaccess_file; then
   search_str="^( +)# Allow access to test-specific PHP files:";
   new_setting="\1# Allow access to custom aafc iframe files:\n\1RewriteCond \%\{REQUEST_URI\} \!\/atlas\/API\/apps\/ewi\/index.html?lang=fr\$\n\1# Allow access to test-specific custom aafc iframe files lang=fr files:\n";
   sed -r "s/${search_str}/${new_setting}/gm" $htaccess_file > ${htaccess_file}_temp;
   cp ${htaccess_file}_temp ${htaccess_file}
fi
if ! grep -q "upgrade-insecure-requests" $htaccess_file; then
  if [ -z $1 ]; then
    echo "dev environment setup.\n";
    echo "`hostname`" > temptesthostname.txt
    if grep -q "ryzen" temptesthostname.txt; then
      #echo "Ensure header always sets Content-Security-Policy. (check post_install.sh)";
      search_str="^( +)Header always set X-Content-Type-Options nosniff";
      new_setting="\1Header always set X-Content-Type-Options nosniff\n\1Header always set Content-Security-Policy \"upgrade-insecure-requests;\"\n"
      #sed -r "s/${search_str}/${new_setting}/gm" $htaccess_file > ${htaccess_file}_temp;
      #cp ${htaccess_file}_temp ${htaccess_file}
    else
      echo "This environment probably does not need the upgrade-insecure-requests";
    fi
    rm temptesthostname.txt
  else
    if [ $1 == "live" ]; then
      #echo "Ensure header always sets Content-Security-Policy for live environment. (check post_install.sh)";
      search_str="^( +)Header always set X-Content-Type-Options nosniff";
      new_setting="\1Header always set X-Content-Type-Options nosniff\n\1Header always set Content-Security-Policy \"upgrade-insecure-requests;\"\n"
      #sed -r "s/${search_str}/${new_setting}/gm" $htaccess_file > ${htaccess_file}_temp;
      #cp ${htaccess_file}_temp ${htaccess_file}
    fi
  fi
fi

if [ ! -L "html/libraries/wet-boew/js/deps/jsonpointer.js" ]; then
  pushd html/libraries/wet-boew/js/deps;
  echo "ln -s ../../../../../custom/js/jsonpointer.js jsonpointer.js;";
        ln -s ../../../../../custom/js/jsonpointer.js jsonpointer.js
  echo "workaround for dcrid 1615574131931;"
  popd
fi
if [ ! -L "html/libraries/wet-boew/js/deps/json-patch.js" ]; then
  pushd html/libraries/wet-boew/js/deps;
  echo "ln -s ../../../../../custom/js/json-patch.js json-patch.js;";
        ln -s ../../../../../custom/js/json-patch.js json-patch.js
  echo "workaround for dcrid 1615574131931;"
  popd
fi
if [ -d "html/libraries/jquery.inputmask/dist/min" ]; then
  echo "fix jquery inputmask distribution"
  echo "cp html/libraries/jquery.inputmask/dist/min/jquery.inputmask.bundle.min.js html/libraries/jquery.inputmask/dist/jquery.inputmask.min.js;"
        cp html/libraries/jquery.inputmask/dist/min/jquery.inputmask.bundle.min.js html/libraries/jquery.inputmask/dist/jquery.inputmask.min.js;
fi
if [ ! -d "html/libraries/jquery-ui-touch-punch" ]; then
  echo "mkdir html/libraries/jquery-ui-touch-punch;"
        mkdir html/libraries/jquery-ui-touch-punch;
  echo "wget https://raw.githubusercontent.com/furf/jquery-ui-touch-punch/master/jquery.ui.touch-punch.min.js;"
        wget https://raw.githubusercontent.com/furf/jquery-ui-touch-punch/master/jquery.ui.touch-punch.min.js;
  echo "mv jquery.ui.touch-punch.min.js html/libraries/jquery-ui-touch-punch;"
        mv jquery.ui.touch-punch.min.js html/libraries/jquery-ui-touch-punch;
fi

if [ -f html/splash.php ] && [ ! -L html/splash.php ]; then
  echo "rm html/splash.php"
        rm html/splash.php
fi
if [ ! -L html/splash.php ]; then
  echo "chmod 775 html"
        chmod 775 html
  echo "cd html"
        cd html
  echo "ln -s ../custom/splash/splash.php splash.php"
        ln -s ../custom/splash/splash.php splash.php
  echo "cd ..;"
        cd ..;
fi
if [ ! -L html/splash-fancy.php ]; then
  echo "cd html"
        cd html
  echo "ln -s ../custom/splash/splash-fancy.php splash-fancy.php"
        ln -s ../custom/splash/splash-fancy.php splash-fancy.php
  echo "cd .."
        cd ..
fi
if [ ! -L html/sites/default/splash ]; then
  echo "chmod 775 html/sites/default"
        chmod 775 html/sites/default
  echo "pushd html/sites/default;"
        pushd html/sites/default;
  echo "ln -s ../../../custom/splash/sites/default/splash splash"
        ln -s ../../../custom/splash/sites/default/splash splash
  echo "popd;"
        popd;
fi
if [ ! -L html/sites/default/files/splashimages ]; then
  pushd html/sites/default/files;
  ln -s ../../../../custom/splash/sites/default/files/splashimages splashimages
  popd;
fi
if [ ! -L html/res ]; then
  pushd html;
  ln -s ../custom/js/res res
  popd;
fi
if [ ! -L html/resources ]; then
  pushd html;
  ln -s ../custom/php/resources resources
  popd;
fi

if [ $live -eq 1 ]; then
  echo "Do not use minified css";
else
  #Use minified theme.min.css.
  #cp html/libraries/theme-gc-intranet/css/theme.css html/libraries/theme-gc-intranet/css/theme.min.css
  # Uncomment the above line if needing the source css for the gc intranet theme library css.
  echo "Use the minified css in dev (for now)."
fi

dbSetupTest=0

if grep -q "namespace' => 'Drupal" html/sites/default/settings.php
then
  echo "Database settings in html/sites/default/settings.php is already configured.";
  dbSetupTest=1;
else
  echo "chmod 775 html/sites/default"
        chmod 775 html/sites/default
  echo "Assuming that the mysql database name is the same as the username.\n";
  printf "\n";
  read -t 60 -p 'Mysql database Username: default (60 seconds) is: username:' uservar
  read -t 60 -sp 'Mysql database Password: default (60 seconds) is: password:' passvar
  settings_file=html/sites/default/settings.php;
  printf "\n";
  read -t 2 -p "Confirm username $uservar" confirm
  printf "\n";

  if [ -z $passvar ]; then
    passvar=`whoami`;
  fi
  if [ -z $uservar ]; then
    userver=`whoami`;
  fi
  echo "chmod 664 $settings_file"
        chmod 664 $settings_file
  echo "\$databases['default']['default'] = array (" >> $settings_file
  echo "  'database' => '$uservar'," >> $settings_file
  echo "    'username' => '$uservar'," >> $settings_file
  echo "    'password' => '$passvar'," >> $settings_file
  echo "    'prefix' => ''," >> $settings_file
  echo "    'host' => 'localhost'," >> $settings_file
  echo "    'port' => '3306'," >> $settings_file
  echo "    'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql'," >> $settings_file
  echo "    'driver' => 'mysql'," >> $settings_file
  echo "  );" >> $settings_file
  echo "chmod 555 html/sites/default"
        chmod 555 html/sites/default
fi

if [ ! -L html/modules/contrib/wxt_ext_translation ]; then
  echo "For Drupal 9, probably no longer need to look at restoring wxt_ext_translation as this upgrade related bug was fixed upstream by statcan wxt maintainers."
  #echo `pwd`
  #pushd html/modules/contrib/
  #ln -s ../../../custom/archives/wxt_ext_translation wxt_ext_translation
  #popd
  #echo `pwd`
fi


if grep -q "# Directories" $robotstxt_file; then
  if ! grep -q "AAFC Directives" $robotstxt_file; then
    if ! grep -q "atlas/data_donnees" $robotstxt_file; then
       search_str="^(# Directories$)";
       # *************** INSERT ROBOTS.TXT / robots.txt DIRECTIVES AS FOLLOWS *******************
       declare aafc_directive_1="Disallow: \/atlas\/data_donnees\/"
       declare aafc_directive_2="Disallow: \/atlas\/rest\/services\/"
       declare aafc_directive_3="Disallow: \/atlas\/services\/"
       declare aafc_directive_4="Disallow: \/eng\/"
       declare aafc_directive_5="Disallow: \/fra\/"
       declare aafc_directive_6="Crawl-Delay: 60"
       #EXAMPLE:
       #declare aafc_directive_7="Disallow: \/example\/directive7\/"
       #declare aafc_directive_8="Disallow: \/example\/directive8\/"
       #declare aafc_directive_9="Disallow: \/example\/directive9\/"
       #declare aafc_directive_10="Disallow: \/example\/directive10\/"
       #declare aafc_directive_11="Disallow: \/example\/directive11\/"
       #declare aafc_directive_12="Disallow: \/example\/directive12\/"
       #declare aafc_directive_13="Disallow: \/example\/directive13\/"
       # *************** END OF AAFC ROBOTS.TXT / robots.txt DIRECTIVES  *******************
       new_setting="# AAFC Directives.\n";
       #Disallow: \/atlas\/data_donnees\/\n\1";
       i=0
       aafc_directives=$new_setting;
       while [[ $i -lt 100 ]]
       do
         i=$((i+1));

         another_directive="aafc_directive_$i";
         #echo "${!another_directive}";#FOR DEBUGGING
         if [ -z "${!another_directive}" ]; then
           aafc_directives="$aafc_directives\\1"
           break;
         else
           aafc_directives=$aafc_directives"${!another_directive}\n"
           echo "Adding AAFC robots.txt directive number $i : ${!another_directive}"
           #echo "$aafc_directives"#FOR DEBUGGING, if you want to debug, uncomment this line.
         fi
       done
       sed -r "s/${search_str}/${aafc_directives}/gm" $robotstxt_file > ${robotstxt_file}_temp;
       cp ${robotstxt_file}_temp ${robotstxt_file}
       echo -e "${BOLD}$robotstxt_file${VERT} file manipulation is${NC} ${BOLD}complete${NC}";
    fi
  fi
else
  echo "";
  echo -e "${RED}robots.txt${NC} processing ${RED}**FAILED**${NC}, please review why # Directives was not found, was the structure of robots.txt changed by core ?  If so, review changes and adjust, instead of looking for # Directories look for another spot to insert the AAFC robots.txt directives.";
  echo -e "${RED}exit in error${NC}";
  exit 1;
fi


drush status --field=Database 2>/dev/null > test-connection.txt || true; # Ignore errors.

if grep -q "Connected" test-connection.txt; then
  echo "";
  echo "Connected to the database, setting up the db views now.";
  #Run Create or Replace View sql command
  echo  "Creating view: drush sql-query --file=../custom/dbviews/search_node_url.sql";
                        drush sql-query --file=../custom/dbviews/search_node_url.sql;
else
  echo "The database is not yet configured, cannot install the db views at this time.";
fi
rm test-connection.txt;

