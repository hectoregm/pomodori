powify server stop
rake db:drop && rake db:create && rake db:migrate && rake db:seed
powify server start
say "Finished restart"
