
    <span>WU</span>  in this i want to add logo 
<div class="poster">
        <div class="header">
            <div class="header-left">
                <h1>Western Union</h1>
                <h1>TEC Pune</h1>
                <div class="subhead">SECURITY PROTOCOLS</div>
            </div>
            <div class="header-right">
                <span>WU</span>
            </div>
        </div>
        
        <hr />
        
        <div class="content">
            <div class="column">


     
        .header-right {
            font-size: 52px;
            font-weight: 800;
            position: relative;
        }
        
        .header-right::before {
            content: "";
            position: absolute;
            width: 80px;
            height: 80px;
            background: #000;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 0;
        }
        
        .header-right span {
            color: #ffd400;
            position: relative;
            z-index: 1;
        }
        
        .subhead {
            font-size: 22px;
            letter-spacing: 3px;
            font-weight: 700;
            margin-top: 8px;
            background: #000;
            color: #ffd400;
            display: inline-block;
            padding: 8px 20px;
            border-radius: 4px;
        }
        
        hr {
            border: 0;
            border-top: 3px solid rgba(0,0,0,0.4);
            margin: 20px 0;
        }
        
        .content {
            display: flex;
            justify-content: space-between;
            gap: 40px;
        }
        
        .column {
            flex: 1;
        }
        
        h3 {
            font-size: 20px;
            margin-bottom: 8px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        h3 i {
            color: #000;
        }
