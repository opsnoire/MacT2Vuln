
<!--

function ShowURL(URLString, initial_max_num_of_characters, line_max_num_of_characters)
{
	var rawURL = URLString;
	var URLToShow;	
	
	if (rawURL.length > initial_max_num_of_characters)
	{
		URLToShow	= rawURL.substring(0, initial_max_num_of_characters)+"<br>";
		rawURL		= rawURL.substring(initial_max_num_of_characters, rawURL.length);
					
		while (rawURL.length > 0)
		{
			var rawURLLength	= rawURL.length;
			var substringTo		= line_max_num_of_characters;
			
			if (substringTo > rawURLLength)
				substringTo = rawURLLength;
				
				
			URLToShow = URLToShow + rawURL.substring(0, substringTo);
			
			if (substringTo < rawURLLength) {
				URLToShow +="<br>"
			}
			
			rawURL = rawURL.substring(substringTo, rawURLLength);
		}
		
	}
	else
	{
		URLToShow = rawURL;
	}
	
	document.getElementById("restrictedURL").innerHTML = URLToShow;
}

function ShowNetworkBlockpageIcon()
{
	var imageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAT3ElEQVR4nO2dfYwc5X3HPzOz76+zL/YdfilnwAbHDRx2omIM2MYOLwfYPg7TSFQK5g9H1H8U/5MI/iggVVRNVaWtVCqrfwCKUrVXkSYVRUJKyzmFhtJYORRCgAI6WiBg87Lns+/27nZv+8fs7M7OzczOzM7uzC73lR7t3NzM8zwzv+/v5XmbB9awhjWsYQ1rWMMa1rCGNazhS4MaiLV9hGqTSH7XxS8IflegxxBe+HMS+2/mquUam5mnGBIo1GqcL8PbpQXee3WWj++9lwW/K9orfGkIMHkUac+DXCFL3CNe4JuhGJuFMFEkQlSprJSZrdZ4cznKvy6k+NHpP2Pm3n+i6ne9u40vAwEEgPefZ3tO4vFEirukLNGG0ReAWj1VoDLL4vIS/zJX40+GDvK65r8DCdHvCnQZAsBPnyGfCnE8nuGwlCdKqP4fQXOVCEQgVCQaSTMeqnDyjWcZ0uYziBhkAggAR0HcNsyNMYH7QjJhRJrCN0oiSGlCyQh3JxPccvQoYW1+g4ZBJgCA8O2/oxipcDSao2D7aUWI5kjHK/z+Q0e4hAEVPgwuAQRA2AXSxiI3pMLcIiUdCjGOkElxw/osB4AwrU5jYDCoBAAQ/vgvyWckJmJ5B9rfuBuiMqnUCkdPT7KB1ohhYDCIBGh49C0b2ZkOs19KIlj6fbOUQMhl2TMU42ZohI4DhUEkAIDwxMNk5Th3JQqsc93PJ0A0Syorcs+gWoFBI0BDf2//OjtlkTEpbSL+mkEyQhwhl1aswEgzFhgYDBoBoK79hQjjiSKbkLAvbKPrNFbgmcmWFsFAEGGQCNCq/SGN9rvx/9qYv24FhuMcGBkwKzBIBACt9ufr2u9JrooVyAhMDJoVGBQC2Pf9KozMvVWPv2oFIoNlBQaFAADC5GNkCmnGE0NsIozydGoy6PI1TGbXSRDNkcpEmfjbpxhmQKzAIBCgIa6tV7NLhjEppdH+TsfytPfHEOQ4u3+nyB5Aos+FD4NBANBqf14X+WthZvbtuIIaIEJYJpMVuevZUxQYACvQ7wQw1n4zwRudMxO8yT1SHEGOc2DHBvbsajqNvkW/EwBAeO5J0rkohxM5Nq16IiOhWrkE/TX660WIyRRSEhOPnKJIn1uBfiZAQ/vzObZn4RtS0sT3Gx3bcQH64zqkJIIc5eAgWIF+JgCA8J1DxIdz3JEaYkvLcI1+xg8Gx4Y5tslDACSIFSikQv1vBfqVAA3tv+8BviLXOBJKEW7M71Oh194asFJPVYu0orneKA9ASgyGFehXAkBd+9MxDqXXsXVVt4/ejFeBReAicB4oGaRZ4AJQBiq0EkH/K0Is3/9WIOR3BVygvfYbCf9iPcVHYPgIZPdCSG7mWgPmp+HsT+DcFMSAJBBFUZP6wJD2ep0V+MmZPpxB3I8EAK32F+vabyX8ORTNvvJR2PSYea7pfTD0EMxNwf+chNI0yLSSAJpEUK3AIhOPnOLliW9zliZV+oII/eYCWrQ/J3I4lLaY6VsD5lFM+uhT1sLXIr0PrnkRMqOKu1CXhxgEiFISQY73byzQbwQAjfan8mxDRPHVNd1vFVhCEeDlj0LhfmelSDJc/SIgK9ajqitDPRbq/QJ9Ggv0EwFatR8ON3y/FloXUAaSI/Y1Xw9Jhu3fhwWagteXQz0W6FMr0E8EAK32F9lmOuCraucicOkfdVZi7oiS3zKGnUKNFoFMIR3i7u9+r7/GCPqFAKu1P20S+WtRAbL7OitZkqGwr0kAk9BOiiOkI+y/aivX0hotBBr9QgAA4Q+PEkvFGEsW675fD6Mu3fho5yXn97a/RoJEjnXZKIeeeJgsawTwDA3tf+AoW1I1bgsnCAXi9eqsgZRCksOM3X4dO1k9szCQ6AcCAHD8OBE5xa1yjquJ2HypXrbE9S0Ao7wlSBbYWEgw3i9WIOgEaART37qByzIhxiMZom1X+KrJw0mhq6aRmcwgltJIstg/ViDoBAAQjh8nOlTktmyWnUQdvMyV9pc4htnkEhUSJPJs6hcrEGQCtGq/yHgkRRRYHejpTbN21M8LrGiSjbkEUhJJpj+sQJAJAFrtlx1ov1Yjl2Y6r8Xca86ulyBRUKzA5GNkCKjwIbgEWO37046MvwIJWJzpvDbLJcdzgKWUEgtsvZZdBNgKBJUA0InvB+VVh4DyTOc1+WLaueg0sUCQrUAQCdC59muGa1mY6aw21RIsObcA0B9WIIgEAFX7h7gtm2MnMaw/8GDULJNQFnCVTndWk/lpxZJovyxmp/y6BQp6LBA0AjS1/2Yuy4jc7cr3qwgBF2c6q9GFaYhoa4a5Hhuck1JIcii4ViBoBAAQRiC8Ls2BbJpRwgi2p3Lre+kEYG6ms9osl5qzgbTNS5tNQkRIyGzKRTn83JOkCZDwIVgEaOjYD37IhpTIWCRNrKOBVfXp5qbc1+rz06t7FJ3GAkmkLHwjn2M7AbMCQSIA1LV/vczN+Sy7NeJ3BxFlPl8nLYGl0mr/D87EJ0GqyJbhHHd85xBxh3d3FUEhQOO1PjPJJZkQE9EsKcvXZOcVqsFgJy2B2elmoOemDvXrQhnCssiR+x7gKwTICgSFAFDX/uEkB3Jp9tjW/nZXhXDek6diaUbx414MKkmQzrM1HeNQkKxAEAjgXPutcjJoirFUclez8oz7rwPq7wmoFQgCAcCt9rfNtZ7OTbm7/+K0ov1evaUAWgG/CeCt9hudU5e+VF1YgeWS0gdgp1ybMUkoQzgncjgoVsBvAkC3tF+FOoFjftr5vaXTzTfklagkSOXZFhQr4CcBuhP5G90TwV1TcLHeBNS/pU5EFjAr4LcFEEYgPBznQC7JHqId9Pq16Y1z1RT8fLp93m6SGBwr4BcBWrU/zERUdun7LXOv/0o4bwouzjRjCJv9/rYhQChNWIbDR4/52zvoqwsYUX1/hj3E24z42R2FE3W/Eu5cwNIMjW8NelEvg+ZpqsjWbJRbb7mlPtXNB/hBAO8if7Oc9RBRJnU4QWmq6f+7oZcChBOEsxJjj/4BW2ilTc/gmwsY6Wbk31ISzZ48J/MDq7OtTUAjI+1mXECLKIIsMzpU5Lbjx9s2OLuCXhOgVfslJqIZUoB3AZ/ZPSLO3MCsZhqY10Ggpl6RFNGMyPi3buAyOqeUY/jiAkbUyD/VRe3Xvsr6t3656MANXJzxbmGJFaIIWZmddSsQZYBdQEMkf/HXFDMhDnnm+7W5m52LABUHvYEXZszfjpciEiCS9s8K+OECpB1buC4d53pPtN9uE00EvjhtL8/56abV6MUb8tEK9IoADVY/e0r5zGosQx5onWLVrVSr12DBpgWo1KeBqZ+acVqWi/pFkkQztd5bgZ66gF0g7tjAHjnBQSmNYPrN/k6SZHAuhOIC5mzGAOenlD6AUD0/bbIqp5MUR8gWem8FekGABpsfOUUxFWIi5mQb105LVktXy7PTFKzMts4EbleGF2jGAnf30gr0zAU0tD/OQSnR4UOZ3W3URlchomi1naVi56fNu2W6KY4oQjbL6Lpc77al6TYBWrVf8f0FwHsf385fq9/6K021r/Wn9T4ANzFAh88RSRBLiYz94Ie92aiyJ4Z4F4g7htgjRznoeBNnRyVZ/E+1AMuz7fPRLgbtdedsHCGfZvf6TG82quwmAVq1P9Jj36//W+0QahcIzk25N/0ejWdEs6QyYm+2qOu6C+iZ9pvWQHNsZ6lYpdT8NrCdWKMb6OFGld0iwGrfL1NAoHv96nbHA9otFbtgMQZgdK5LdY1merNRZVddQEP7ExyUUi7G+92MuYsWx2pb3mp+YPn9ZhNQvc9OWV6nBEIu030r0A0C+OP7rXy2Vn/CWM8QXpjpXRewFXoUC3TNBfju+xs10Ryr2jw7ZX59adp/4avoQSzg9aP65/vNlmvrz0tYNwXLpeYwsF/xSg9jga64gIb2x33WfljtCkSUnj4jqMvItWsBrPLrBWIIcoLri2H24n6hmim8JMBq7e9Vu98Jwpg3BRdnMJ2e6ReNRQhnSefDjD17ijweWwHPXUCL70/gbp5/N10DmDcF52eab8QsH7tfBvEwSQnlU/Q7hrzftNorAqzW/nwAtV91AWD81ZC513ozDcwpxPrmVBITXm9a7akLaPH9Xrf79QmX94mYfzVkfqZ1LYDbMrqQpFR9W5ohb7el8YIAjVf13e9RSIvc7Wuvn5WpVr8dLAH/90zrU5yfgnOaUUArN9LufDeS0J1Nq73aN1AAhKu2cG1aYn/H4/1eo6Y5FlB6+j6Zgl+NQ/Ya5f/v/JViGTyPs71DY9PqIe82qvTC4wmA+MQJ5K9v48HCem4UEz32/mavwOy8ulzs4ptw/jTMnoZQGdK0hlh6N6A/p/3F5G8vIYAkEV+6yMpl+/iPyeeYp2Ef3KFTQTW81O172SmLjElJpJ6ZeTvmXz9RUyVFBGVr2Hj9NwGNHUit8vE5SQkEOczBHUVvYgFPYoAnTpAtRBlPFtkYmM1oaybH6g7hFZqzffQ7h+sNq9mx0d/dhljfut6jWKATArRqv8SYlA5AI8pKcKomL6DsJ/wp8FH9d65+vkornLqXHkCNBbYVua5TK9CpviraH2Y8kWNTYy59t2EkZO2v/riGovHzwIKsbCZ56f2QGGnms1yCj34MHz4D81OKS9AGhGbNUNocdwmxDLnMAmMTJ/jZmb+hhEtKurUAwdB+q0fWEqFCfRPoUbjpl7D9sVbhA4RlhRTXvwjrH4VZWncLNSrXTyugbE51y+17O9uWxq3QBECcPEl22wgn8kX2i8keRP7tfLOZ5s8Cwijc9CLEhtuXs24frMjwyQtKsKjtHrZbz25DhJBAqrrA/Lp1/Oe//TeLbkp2I7QG27buZpcsMiZlfPb9VkHaAlCWYfc/K1puF1c8BKkjNBpaPmq7GaRMfYu6DqyAaxcweZJMQWI8UWBTo/kUlKQ2+RaBErD5/tUm3w6++n3FeiyZlOH3c6qbU0mMP3HC3RZ1TgnQqv0EQPvNUEMRXAW4wuUO4skRyO1T8rFTng+QMvUt6lxaAVcuYPIkmQKMJ4oB0n4jjVwA4iOKIN2isFfJx6wsv8cJJEgU2VSA8cmTzrelcUKA4Pn+dljEnenXQh5V8gkw1Fhg627n29I4dgEN7c9r2v1BTYt03i8RkpsdRNreQv26RLP1ir1IYn2LOhdWwC4BWrV/hTEpGzDtN3pkr7qltesEzF6tzyOIUhYpW2Fs2yjX4MAKOHIBDe1fz6bA9PlbIYb7vQJUnJ1S8gk6JEisZ0Muxq1OPj9rhwCt2l+t+36/gz47KYoyz78TEnzxmmIBtPliUJbfzUKUj1Cnl7nzvnvsf4Tajhlv9vpt5kS+wH4x5dNsv5rJ33qhaDEPhIeheJ3z8pZK8ItjINPxzmE9gQhhyJWX+Cy6zH+9/BYVVr8R/S2WaNX+ZcYk2Uffb8f/ao/DQAb49ePurMDrjyvC18YATuvWSwgQkgnLixyxawXaCVMAxOf+lMylaR4srONm37RfRc3i2MgShIClMpx7C0a+ab+cd5+G9x5WCKR94h6P+jmGCGERuVzms2ilvRWwEmaDPbEsmzOL3BSI8X4tzKZjaTkvoWjx+R/Dz4/ZswTvPg1vHIMsrXsGmpXbrl69hAChLOHsMnfecyeX08YK2AoCwxWuCIXYGPh2v779rektQwZKT8Pz18I7TxsT4fNp+Nk4vK0Rvj4/v9v8dpIEySSXJ0J8jTYyNmvMaXVJioW4PJqiFwO+7aFON9f/bXUeFBJkUT4T984xeP0YxEdBkJW3sDANUklp8mU1eai/7SaDBgkCSHGiS59z+a5dhM6coYrxW7JszQugLPaYXyBJDcE6nuwhzFoD2mP9r4oISnCYBtAsEm23ZYPh6zM4Z3SNDxAExFCF9ZurRM4ow1mGNWvXnSOcAeHsLLPVMsvUiASC+VYvXa/5elj9T5uf/rjduSChBitVVj5bYOHTaksM4IgADcN3rsRv5+e4GK/i92LvJoy0zMoSGN2jJ5H2vKA7NiJYO2vgF1ZgcZbyex/z3ku/ooIFVW0FgS+9zv9+OM8M84F4PAVGj2Smpfpjp38bHdupj18oU/vsCz5++wPeqp8xrZ2tHv0XfskHe7/Ky1es43cTCXq97sca7SyBnb/15wWDv82shdH//cQKlM+x9POPeOVHp3nP4IqW2pq161W+i4BULlMTRZavHGb7JTkuEWMIgWG8HW00asdbJf01ZvlY1cEP1KBSYuUXv+bMky/w1Ctv8hbK3GazJS+2CCAC4tsfMB9OIWwIs74YoyiFEVs0xeeBEMNz+vNOYKcMq/O9TFVgCZbOsvz6b/jN06/wj3//70yhjISoa6AM34JV77qAQhD1a/tx4JI7fo+9993IbV9bz7ZimkIkRlgIigZYTf5wY6KtnisgbrC2AovzLJ67yOevfsKb//ASP33+VU6jrHkqozQBVSuwigTtCKB+XjFSTzFA3pTnqiu3sG3rRjZkEyQQEFgJjCH88kCkxgorn85x4d0P+e0b7/PW2RLvoMyFLqPMiVpGsQKGLsBKaFoXEK6nKE0iJOvJl/3u1tCCMoq5n6ep9WrSLoN13BGk9TIqIdTzSygLriwHG9bQVegjgSqKxqtabyp4FVYEUG9SPatAc7VcfcjBt6/qr0GBEQEqmqQfFlsFO/0A2gJU4VdpflF3jQD+QUsAVS76ucuW4a8doWlbxvq9rtaE7y+0DVGjgema7rpVsCs4o+6Rdp2ja+gN7PRSmMKp4PppVPzLBr3AbfV8uBXgmuCDC0ddXv8PQnoOHg7pqmsAAAAASUVORK5CYII=";
	var imageTag = '<img src="data:image/png;base64,'+imageBase64+'" alt="Warning Icon" width="96" height="96" />';
	
	document.getElementById("icon").innerHTML = imageTag;
}


function LoadPage(URLString, initial_max_num_of_characters, line_max_num_of_characters)
{
	ShowNetworkBlockpageIcon();

	ShowURL(URLString, initial_max_num_of_characters, line_max_num_of_characters);
}

function LoadNetworkPage(URLString, initial_max_num_of_characters, line_max_num_of_characters)
{
	ShowNetworkBlockpageIcon();
	ShowURL(URLString, initial_max_num_of_characters, line_max_num_of_characters);
}

function PromptAllow( overideBlockURLString ) 
{
	window.open( overideBlockURLString, "_self")
}


function GoBack()
{
	history.back()
}

-->
