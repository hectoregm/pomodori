Rails.application.routes.draw do
  resource :today, only: [:show]

  get 'dashboard/index'
  get 'dashboard/today'
  get 'dashboard/week'

  resources :projects, only: [:index, :create, :destroy] do
    resources :tasks
  end

  resources :tasks do
    resources :pomodori, only: [:new, :show, :create, :destroy]
  end
  root 'today#show'
end
