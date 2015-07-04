class PomodoriController < ApplicationController
  before_action :set_pomodoro, only: [:show, :edit, :update, :destroy]

  # GET /pomodori
  # GET /pomodori.json
  def index
    @pomodori = Pomodoro.all
  end

  # GET /pomodori/1
  # GET /pomodori/1.json
  def show
  end

  # GET /pomodori/new
  def new
    @pomodoro = Pomodoro.new
  end

  # GET /pomodori/1/edit
  def edit
  end

  # POST /pomodori
  # POST /pomodori.json
  def create
    @pomodoro = Pomodoro.new(pomodoro_params)

    respond_to do |format|
      if @pomodoro.save
        format.html { redirect_to @pomodoro, notice: 'Pomodoro was successfully created.' }
        format.json { render :show, status: :created, location: @pomodoro }
      else
        format.html { render :new }
        format.json { render json: @pomodoro.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /pomodori/1
  # PATCH/PUT /pomodori/1.json
  def update
    respond_to do |format|
      if @pomodoro.update(pomodoro_params)
        format.html { redirect_to @pomodoro, notice: 'Pomodoro was successfully updated.' }
        format.json { render :show, status: :ok, location: @pomodoro }
      else
        format.html { render :edit }
        format.json { render json: @pomodoro.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /pomodori/1
  # DELETE /pomodori/1.json
  def destroy
    @pomodoro.destroy
    respond_to do |format|
      format.html { redirect_to pomodori_url, notice: 'Pomodoro was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_pomodoro
      @pomodoro = Pomodoro.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def pomodoro_params
      params.require(:pomodoro).permit(:started_at, :completed_at, :length)
    end
end
